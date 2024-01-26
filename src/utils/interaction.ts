import { getId } from "@lidakai/utils";
import { toNumber } from "lodash-es";
import { isContainerChildren, isJsonString } from "./utils";
import qs from 'qs';
import { Interaction } from "@/type/Interactions.type";
import { Events } from "@/type/screen.type";

export function getActions({
    data,
    events,
    getCallbackValue,
    index, // 当前点击组件的下标-  如果是组件容器内组件的话
}: {
    data: any;
    events: any;
    index?: number;
    getCallbackValue: (x: string | string[]) => void;
}) {
    return events.reduce((all: any[], item: any) => {
        const { reverse = true, trigger, id: eventId } = item;
        if (
            isOnConditions({
                type: item.conditionType,
                conditions: item.conditions,
                data,
                getCallbackValue,
                index,
            })
        ) {
            let action;
            if (item.actions) {
                action = item.actions.reduce(
                    (all: any, acc: any) => all.concat(getAction(acc, data, getCallbackValue)),
                    [],
                );
            } else {
                action = getAction(item, data, getCallbackValue);
            }
            if (action) {
                return all.concat(
                    Array.isArray(action)
                        ? action.map((d) => ({ ...d, trigger, eventId }))
                        : Object.assign(action, { trigger, eventId }),
                );
            }
            return all;
        }
        if (reverse) {
            let action;
            if (item.actions) {
                action = item.actions.reduce((all: any, acc: any) => all.concat(getReverseAction(acc)), []);
            } else {
                action = getReverseAction(item);
            }

            if (action && action.length > 0) {
                // 将反向的操作放置在满足的动作之前执行
                all.unshift(...action.map((d: any) => ({ ...d, trigger, eventId })));
                return all;
            }
            return all;
        }
        return all;
    }, []);
}



function isOnConditions({ type, conditions, data, getCallbackValue, index }: {
    index?: number;
    data: any;
    type: "all" | "one";
    conditions: any[];
    getCallbackValue: (x: string | string[]) => void;
}) {
    if (conditions.length === 0) {
        return true;
    }
    if (type === 'all') {
        return conditions.every((condition) =>
            isOnCondition({ condition, data, getCallbackValue, index }),
        );
    }
    if (type === 'one') {
        return conditions.some((condition) =>
            isOnCondition({ condition, data, getCallbackValue, index }),
        );
    }
    return true;
}

interface Condition {
    type: 'field' | 'custom';
    field: string;
    code?: string;
    compare: string;
    expected?: any;
    containerIndex?: string;
}
type GetCallbackValue = (x: string | string[]) => void;

function isOnCondition({ condition, data, getCallbackValue, index }: {
    condition: Condition;
    data: any;
    getCallbackValue: GetCallbackValue;
    index?: number;
}): boolean {
    const { type, field, code, compare, expected, containerIndex } = condition;
    const search = document.location.search.split('?')[1];
    const query = search && qs.parse(search);
    if (query && query.useFilter && query.useFilter === 'false') {
        return data;
    }
    if (type === 'field') {
        let fieldResult = false;
        if (Array.isArray(data)) {
            fieldResult = data.some(
                (d) => typeof d === 'object' && d !== null && compareValue(d[field], expected, compare),
            );
        } else if (typeof data === 'object' && data !== null) {
            fieldResult = compareValue(data[field], expected, compare);
        } else {
            fieldResult = compareValue(data, expected, compare);
        }

        if (containerIndex && (field === '' || expected === '')) {
            // 组件容器 改策略
            // todo: 当组件容器且 字段或者结果存在为空的情况默认为true
            fieldResult = true;
        }

        if (index && containerIndex) {
            // 组件容器的下标
            return fieldResult && parseInt(containerIndex, 10) === index;
        }
        return fieldResult;
    }

    let result = false;
    try {
        // eslint-disable-next-line no-eval
        const func = new Function('data', 'getCallbackValue', 'index', code as string);
        result = func(data, getCallbackValue, index);
    } catch (error) {
        console.error(`自定义事件自定义条件执行时出错code:\n${code}`);
    }
    return result;
}


function compareValue(value1: any, value2: any, symbol: string): boolean {
    switch (symbol) {
        case '==':
            return value1 == value2;
        case '!=':
            return value1 != value2;
        case '>':
            return toNumber(value1) > toNumber(value2);
        case '>=':
            return toNumber(value1) >= toNumber(value2);
        case '<':
            return toNumber(value1) < toNumber(value2);
        case '<=':
            return toNumber(value1) <= toNumber(value2);
        case 'include':
            return value1?.toString?.()?.includes(value2);
        case 'exclude':
            return !value1?.toString?.()?.includes(value2);
        default:
            return false;
    }
}

export function getAction(
    {
        component,
        stateId,
        panel,
        action,
        actionData,
        actionDataFn = 'return data;',
        componentConfig,
        animation,
        unmount,
        translate = {},
        scale = {},
        rotate = {},
    }: {
        component: string[];
        stateId: any;
        panel: any;
        action: any;
        actionData: any;
        actionDataFn: string;
        componentConfig: any;
        animation: any;
        unmount: boolean;
        translate: any;
        scale: any;
        rotate: any;
    },
    data: any,
    getCallbackValue: (x: string | string[]) => any,
) {
    if (!action) {
        return;
    }

    if (action !== 'switchState' && !component) {
        return;
    }

    type ActionDataFn = (data: any, getCallbackValue: any) => any;

    function getActionData(data: any, getCallbackValue: any): any {
        let result: any;
        try {
            const emitData: ActionDataFn = eval(`(function emitData(data, getCallbackValue){
          ${actionDataFn}
        })`);
            result = emitData(data, getCallbackValue);
        } catch (error) {
            console.error(error);
        }
        return result;
    }

    component = Array.isArray(component) ? component : [component];
    function getDynamicData(id: string | number) {
        if (isContainerChildren(id as string)) {
            return getActionData(data, getCallbackValue);
        }
        return undefined;
    }
    if (action === 'show') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                show: true,
            },
            activeState: {
                animation: {
                    key: 'show',
                    ...getAnimation(animation),
                },
            },
            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    if (action === 'hide') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                show: false,
                unmount,
            },
            activeState: {
                animation: {
                    key: 'show',
                    ...getAnimation(animation),
                },
            },
            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    if (action === 'show/hide') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                show: '$not',
                unmount,
            },
            activeState: {
                animation: {
                    key: 'show',
                    ...getAnimation(animation),
                },
            },
            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    if (action === 'switchState') {
        let panelId;
        if (component && stateId) {
            panelId = component[0];
        } else {
            const panelValue = isJsonString(panel) && JSON.parse(panel);
            if (panelValue) {
                panelId = panelValue.panelId;
                stateId = panelValue.stateId;
            }
        }

        if (panelId && stateId) {
            return {
                type: action,
                component: panelId,
                state: {
                    show: true,
                    stateId,

                    [getId(stateId)]: {
                        unmount,
                        animation: {
                            key: 'show',
                            ...getAnimation(animation),
                        },
                    },
                },
                animation,
            };
        }
    }

    if (action === 'updateConfig') {
        return {
            type: action,
            component: component[0],
            componentConfig,
            animation,
        };
    }

    if (action === 'translate') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                translateToX: translate.toX || 0,
                translateToY: translate.toY || 0,
            },
            activeState: {
                animation: {
                    ...getAnimation({ ...animation, type: undefined }),
                },
            },

            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    if (action === 'updateData') {
        return component.map((d) => ({
            type: action,
            component: d,
            animation,
            dynamicData: getDynamicData(d),
        }));
    }

    if (action === 'scale') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                scaleX: scale.x || 1,
                scaleY: scale.y || 1,
                transformOrigin: scale.origin || '50% 50%',
            },
            activeState: {
                animation: {
                    ...getAnimation({ ...animation, type: undefined }),
                },
            },
            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    if (action === 'rotate') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                rotate,
            },
            activeState: {
                animation: {
                    ...getAnimation({ ...animation, type: undefined }),
                },
            },
            dynamicData: getDynamicData(d),
            animation,
        }));
    }

    return {
        type: action,
        component: getId(component[0]),
        data: actionData,
        dynamicData: getActionData(data, getCallbackValue),
        animation,
    };
}

export function getReverseAction({ component: componentProps, action, animation, unmount }: {
    component: string | number;
    action: Events['action'];
    animation: Interaction['animation'];
    unmount: boolean
}) {
    if (!action) {
        return [];
    }

    const component = Array.isArray(componentProps) ? componentProps : [componentProps];

    if (action === 'show') {
        return component.map((d) => ({
            type: 'hide',
            component: d,
            state: {
                show: false,
                unmount,
            },
            activeState: {
                animation: {
                    key: 'show',
                    ...getAnimation(animation),
                },
            },
        }));
    }

    if (action === 'hide') {
        return component.map((d) => ({
            type: 'show',
            component: d,
            state: {
                show: true,
            },
            activeState: {
                animation: {
                    key: 'show',
                    ...getAnimation(animation),
                },
            },
        }));
    }

    if (action === 'updateConfig') {
        return [
            {
                type: action,
                component: component[0],
                componentConfig: {},
            },
        ];
    }

    if (action === 'rotate') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                rotate: undefined,
            },
        }));
    }

    if (action === 'translate') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                translateToX: undefined,
                translateToY: undefined,
            },
        }));
    }

    if (action === 'scale') {
        return component.map((d) => ({
            type: action,
            component: d,
            state: {
                scaleX: undefined,
                scaleY: undefined,
                transformOrigin: undefined,
            },
        }));
    }

    return [];
}


export function getAnimation(config: any) {
    const { type, ...rest } = config;

    switch (type) {
        case 'slide':
        case 'slideLeft':
            return slideFromLeft(rest);
        case 'slideRight':
            return slideFromRight(rest);
        case 'slideUp':
            return slideFromTop(rest);
        case 'slideDown':
            return slideFromBottom(rest);
        case 'zoom':
            return zoom(rest);
        case 'fade':
            return fade(rest);
        default:
            return { config: rest };
    }
}

const fade = (config: any) => ({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
    config,
});

const slideFromLeft = (config: any) => ({
    from: {
        opacity: 0,
        transform: 'translateX(-200px)',
    },
    to: {
        opacity: 1,
        transform: 'translateX(0px)',
    },
    config,
});

const slideFromRight = (config: any) => ({
    from: {
        opacity: 0,
        transform: 'translateX(200px)',
    },
    to: {
        opacity: 1,
        transform: 'translateX(0px)',
    },
    config,
});

const slideFromTop = (config: any) => ({
    from: {
        opacity: 0,
        transform: 'translateY(-200px)',
    },
    to: {
        opacity: 1,
        transform: 'translateY(0px)',
    },
    config,
});

const slideFromBottom = (config: any) => ({
    from: {
        opacity: 0,
        transform: 'translateY(200px)',
    },
    to: {
        opacity: 1,
        transform: 'translateY(0px)',
    },
    config,
});

const zoom = (config: any) => ({
    from: {
        opacity: 0,
        transform: 'scale(0)',
    },
    to: {
        opacity: 1,
        transform: 'scale(1)',
    },
    config,
});
