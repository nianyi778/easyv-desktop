import { useCallback, useEffect, useRef, useState, memo } from 'react';
import { define, modules, moduleDependencies, dependencyModules } from '@/utils/define';
import { Events, TransformComponentType } from '@/type/screen.type';
import LoadingSpinner from '@/components/LoadingAnimation';
import ComponentEmpty from '@/components/ComponentEmpty';
import ErrorBoundary from './ComErrorBoundary';
import { getComponentConfig } from '@lidakai/utils';
import { ChildrenConfig } from '@/type/component.type';
import { getActions } from '@/utils/interaction';
import { defaultActions } from '@/constants';
import { Interaction } from '@/type/Interactions.type';
import { useInteraction } from '@/pages/hooks';

interface EasyVComponentType {
    config: unknown[];
    name: string;
    id: number; base: TransformComponentType['base']; spaceId?: number;
    height: number; width: number; left: number; top: number;
    uniqueTag: string;
    data: unknown[];
    events: Events[];
    childrenData: unknown[];
    childrenConfig: ChildrenConfig[];
    childrenEvents: { id: number; events: Events[] }[];
    actions?: unknown[]
}

function EasyVComponent(
    { id, base, spaceId, uniqueTag, height, name, events, config, actions, width, left, top, data, childrenData, childrenConfig, childrenEvents }: EasyVComponentType) {
    const [loadedScript, setLoadedScript] = useState(false);
    const [component, setComponent] = useState<any>(null);
    const updateInteraction = useInteraction();
    const ref = useRef<NodeJS.Timeout[]>([]); // 延时器

    useEffect(() => {
        const { version, module_name } = base;
        if (version && module_name) {
            // 加载组件js
            define(
                `com_${id}`,
                [`${module_name}@${version}`],
                (com: any) => {
                    if (!window.component) {
                        window.component = {};
                    }
                    window.component[`${module_name}@${version}`] = com;
                    setComponent((_: any) => com);
                    setLoadedScript(true)
                },
                spaceId,
            );
        }

        return () => {
            delete modules[`com_${id}`];
            delete moduleDependencies[`com_${id}`];
            dependencyModules[`${base.module_name}@${base.version}`] = dependencyModules[
                `${base.module_name}@${base.version}`
            ]?.filter((d: string) => d !== `com_${id}`);
        }

    }, [base, spaceId]);


    useEffect(() => {

        return () => {
            // 清理延时器
            if (Array.isArray(ref.current)) {
                ref.current.forEach(t => clearTimeout(t));
            }
        }
    }, []);


    const emit = useCallback((events: Events[], data: unknown) => {

        function dispatchEvent(config: Interaction) {
            if (defaultActions.find((o) => o.value === config.type)) {
                const interaction = {
                    ...config,
                    _from: {
                        componentId: id,
                    },
                    controllers: [id],
                };
                updateInteraction(interaction);
            } else {
                const interaction = {
                    ...config,
                    isDefaultAction: false
                };
                updateInteraction(interaction);
                // const event: any = new Event(`${config.type}_${config.component}`);
                // event.data = config.data;
                // event.dynamicData = config.dynamicData;
                // document.dispatchEvent(event);
            }
        }

        const comContainerIndex = -1;
        const actions: any[] = getActions({ events, data, getCallbackValue, index: comContainerIndex }).filter(
            (e: any) => e,
        );
        actions.forEach(value => {
            const { trigger, eventId, ...otherInfo } = value;
            if (value?.animation?.delay > 0) {
                let t = setTimeout(() => {
                    dispatchEvent(otherInfo);
                    ref.current = ref.current.filter(r => r !== t);
                }, value.animation.delay);
                ref.current.push(t);
            } else {
                dispatchEvent(otherInfo);
            }
        });
    }, [id])

    const getCallbackValue = useCallback(() => { }, []);
    const handleEmit = useCallback((eventName: string, data: unknown, componentId: number = id) => {

        // todo:蓝图编辑器的逻辑
        // xxxx

        // 自定义事件逻辑
        if (!componentId || componentId === id) {
            emit(
                events.filter((d) => d.trigger === eventName),
                data,
            );
        } else {
            const childEvents = childrenEvents.find((d) => d.id === componentId);
            if (childEvents) {
                emit(
                    childEvents.events.filter((d) => d.trigger === eventName),
                    data,
                );
            }
        }
    }, [id]);
    const postMessage = useCallback(() => { }, []);
    const handleEmitEvent = useCallback((payload: unknown) => {
        console.log(payload, 'handleEmitEvent')

    }, []);
    const onRelative = useCallback(() => { }, []);

    if (!loadedScript) {
        return (
            <LoadingSpinner
                style={{
                    left,
                    top,
                    width,
                    height,
                    position: 'absolute',
                }}
            />
        );
    }


    if (!component || !id) {
        return <ComponentEmpty
            text={`${id}-${name}(加载失败)`}
            style={{
                width,
                height,
                lineHeight: height + 'px',
            }} />
    }


    const iState = {
        show: true
    };
    const bindedInteractionState = {};
    const interactionCallbackValues = {}

    const Com = component;
    return <ErrorBoundary customErrorChildren={
        <ComponentEmpty
            text={`${id}-${name}组件 (加载失败)`}
            style={{
                width,
                height,
                left,
                top,
                position: 'absolute',
                lineHeight: height + 'px',
                backgroundColor: 'transparent'
            }} />
    } >
        <div id={uniqueTag}
            className=' pointer-events-auto absolute'
        >
            <Com
                id={id}
                data={data || []}
                configuration={getComponentConfig(config)}
                actions={actions || []}
                events={events || []}
                width={width}
                height={height}
                top={top}
                left={left}
                iState={iState}
                bindedInteractionState={bindedInteractionState}
                childrenData={childrenData || []}
                childrenConfig={childrenConfig || []}
                callbackValues={interactionCallbackValues}
                emitEvent={handleEmitEvent}
                postMessage={postMessage}
                emit={handleEmit}
                getCallbackValue={getCallbackValue}
                onRelative={onRelative}
            />
        </div>

    </ErrorBoundary>

}


export default memo(EasyVComponent);