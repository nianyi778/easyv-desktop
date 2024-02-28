import { CallbackState } from "@/type/callback.type";
import { TransformComponentContainerType, TransformComponentType, TransformFilterType } from "@/type/screen.type";
import { deepFind, transformConfig } from "@easyv/admin-utils";

export const reserveCallbackKeys = ['mm', 'ss'];

type ComponentType = TransformComponentContainerType | TransformComponentType


export function getAllCallbackKeys(components: ComponentType[] = [], filters: TransformFilterType[] = []) {
    const callbackKeys = {
        filter: getFilterCallbackKeys(components, filters),
        data: getCallbackKeys(components),
        interaction: getInteractionCallbackKeys(components),
    };

    return callbackKeys as CallbackState['callbackKeys'];
}

export function getFilterCallbackKeys(components: ComponentType[], filters: TransformFilterType[] = []) {
    const callbackKeys: Record<string, unknown> = {};

    components.forEach((component) => {
        const { id, filters: componentFilters } = component;

        if (Array.isArray(componentFilters)) {
            const usedFilters = componentFilters.filter((d) => d.enable);
            const keys = usedFilters
                .map((d) => Array.isArray(filters) && filters?.find((v) => v.id === d.id))
                .reduce((all, item) => {
                    if (item && Array.isArray(item.callbackKeys) && item.callbackKeys.length) {
                        return all.concat(item.callbackKeys as []);
                    }
                    return all;
                }, []);

            if (keys.length) {
                callbackKeys[id] = Array.from(new Set(keys));
            }
        }
    });

    return callbackKeys;
}


export function getCallbackKeys(components: ComponentType[]) {
    const callbackKeys: Record<string, unknown> = {};

    components.forEach((component) => {
        const { id, dataType, dataConfigs } = component;

        const dataConfig = dataConfigs[dataType];
        if (dataConfig) {
            const keys: string[] = [];
            const callbackReg = /:([a-zA-Z]\w*)/g;

            if (
                dataType === 'mysql' ||
                dataType === 'mssql' ||
                dataType === 'oracle' ||
                dataType === 'postgresql' ||
                dataType === 'clickhouse' ||
                dataType === 'damengdb' ||
                dataType === 'db2' ||
                dataType === 'kingbase'
            ) {
                const { config, callbackKeys = [] } = dataConfig;
                const { sql = '' } = config;
                if (callbackKeys.length) {
                    keys.push(...callbackKeys);
                }
                if (callbackReg.test(sql)) {
                    sql.replace(callbackReg, (_, p) => {
                        if (!reserveCallbackKeys.includes(p)) {
                            keys.push(p);
                        }
                        return '';
                    });
                }
            } else if (['api', 'mqtt', 'websocket', 'apiGateway', 'dtInsight'].includes(dataType)) {
                const { config } = dataConfig;
                const { body = '', params = '', path = '', headers = '' } = config || {};
                if (callbackReg.test(body)) {
                    body.replace(callbackReg, (_, p) => {
                        keys.push(p);
                        return '';
                    });
                }

                if (callbackReg.test(params)) {
                    params.replace(callbackReg, (_, p) => {
                        keys.push(p);
                        return '';
                    });
                }

                if (callbackReg.test(path)) {
                    path.replace(callbackReg, (_, p) => {
                        keys.push(p);
                        return '';
                    });
                }

                if (callbackReg.test(headers)) {
                    headers.replace(callbackReg, (_, p) => {
                        keys.push(p);
                        return '';
                    });
                }
            }
            if (keys.length) {
                callbackKeys[id] = Array.from(new Set(keys));
            }
        }
    });

    return callbackKeys;
}

/**
 * @description: config:{ callback:true }
 * @param {*} interaction
 * @return {string[]}
 */
function getConfigCallbackKeys(interaction: { value: any[]; }): string[] {
    // config 来标识callback
    if (Array.isArray(interaction?.value)) {
        return interaction.value.reduce((all, curr) => {
            if (curr.config.callback && curr.value && typeof curr.value === 'string') {
                all = all.concat(curr.value);
            }
            return all.concat(getConfigCallbackKeys(curr.value));
        }, []);
    }
    return [];
}

export function getInteractionCallbackKeys(components: ComponentType[]) {
    const callbackKeys: Record<string, unknown> = {};

    /**
     * @description: {name = 'callback'}
     * @param {*} interaction
     * @return {string[]}
     */
    function getNameCallbackKeys(callbacks: { value: any[]; }) {
        // name为callback的回调字段
        const keys =
            (Array.isArray(callbacks?.value) &&
                callbacks.value
                    .reduce((all, callback) => {
                        if (Array.isArray(callback?.value)) {
                            const configCallbacks = callback.value?.filter((d: { config: { callback: any; }; }) => d.config?.callback);
                            const result =
                                configCallbacks?.length > 0
                                    ? configCallbacks.map((o: { value: any; }) => o.value)
                                    : callback.value?.[1]?.value;
                            return all.concat(result);
                        }
                        return all;
                    }, [])
                    .filter((d: any) => d)) ||
            [];

        return keys;
    }

    components.forEach((component) => {
        // eslint-disable-next-line prefer-const
        let { id, config } = component;
        config = transformConfig(config);

        const interaction = config.find((d: any) => d.name === 'interaction') as any;
        const nameCallbacksConfig = interaction?.value?.find((d: { name: string; }) => d.name === 'callback');
        const otherCallbacksConfig = interaction?.value?.filter((d: { name: string; }) => d.name !== 'callback');

        const nameCallbacks = getNameCallbackKeys(nameCallbacksConfig);
        const configCallbacks = getConfigCallbackKeys(otherCallbacksConfig);
        const keys = Array.from(new Set(nameCallbacks.concat(configCallbacks).filter((d: any) => d)));

        // 除去events交互事件/remoteControl
        const otherConfig =
            interaction &&
            interaction.value.filter(
                (d: any) => d.name !== 'events' || d.name !== 'remoteControl' || d.name !== 'callback',
            );

        // 通过_callback来标识是否为回调字段
        const otherKeys = deepFind(
            otherConfig,
            (item: { config: { callback: boolean; }; }) => item.config && item.config.callback === true,
            'value',
        )
            .map((d: { value: any; }) => d.value)
            .filter((d: any) => d);
        const allKeys = Array.from(new Set(keys.concat(otherKeys)));
        if (allKeys.length) {
            callbackKeys[id] = allKeys;
        }
    });

    return callbackKeys;
}