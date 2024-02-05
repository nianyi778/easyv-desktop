import { Interaction } from "@/type/Interactions.type";
import { useCallback } from "react";
import { useSetRecoilState } from 'recoil';
import { interactions } from "@/dataStore";
import { isUndefined, isNull } from "lodash-es";
import { q } from '@/utils/events';
import { isGeneralPanel } from "@/utils";
import { getAnimation } from "@/utils/interaction";
import { isContainer, isGroup, isComponent, getValueFromConfig, reduceConfig, getId } from "@lidakai/utils";



/**
 * @description 统计事件
 * */
export function useInteraction() {
    const setInteraction = useSetRecoilState(interactions);
    const updateInteraction = useCallback((interaction: Interaction, isDefaultAction: boolean = true) => {
        if (isDefaultAction) {
            interaction && setInteraction((inits) => mergeInteraction(inits, interaction));
        } else {
            // 自定义组件
            q.push(interaction).catch((err: any) => console.error(err)); // 加入队列
        }
    }, []);
    return updateInteraction;
}

type StateKeys = keyof Interaction['state'];

const defaultState = {
    unmount: false,
    show: true,
    stateId: -1
}

export function mergeInteraction(oldInteractions: Interaction[], newInteraction: Interaction): Interaction[] {
    const eventState = oldInteractions.find((d: Interaction) => {
        const { component } = newInteraction;
        return (d.id || d.component) === component;
    });
    const { component, state = {}, activeState = {} } = newInteraction;
    const { unmount = defaultState.unmount, stateId } = state as Interaction['state']; // 是否卸载，默认false 未卸载
    let updateInteraction = { ...newInteraction, id: component };
    // console.log(newInteraction, 'newInteraction');
    if (eventState) {
        return oldInteractions.reduce<Interaction[]>((acc, interaction) => {
            const isCurrent =
                interaction.component === component // 组件id

            if (isCurrent) {
                // 同一个被控组件，且类型相同
                const newState = Object.keys(state).reduce<Record<string, unknown>>((obj, key) => {
                    const k = key as StateKeys;
                    const c = state[key as StateKeys];
                    if (c === '$not') {
                        obj[key] = !interaction.state[k];
                    } else {
                        obj[key] = !(isUndefined(c) || isNull(c)) ? c : interaction.state[key as StateKeys];
                    }
                    return obj;
                }, {});

                const mergeInteraction = {
                    ...interaction,
                    ...updateInteraction,
                    state: {
                        ...interaction.state,
                        ...newState,
                    },
                    activeState: {
                        ...interaction.activeState,
                        ...activeState,
                    },
                };
                // console.log(mergeInteraction, 'mergeInteraction')
                // q.push(mergeInteraction).catch((err) => console.error(err)); // 加入队列
                return acc.concat(mergeInteraction);
            }
            return acc.concat(interaction);
        }, []);
    } else if (state.show === '$not') {
        updateInteraction = { ...updateInteraction, state: { ...state, show: false, unmount, stateId, } }
        // q.push(updateInteraction).catch((err) => console.error(err)); // 加入队列
        return oldInteractions.concat(updateInteraction)
    };
    // q.push(newInteraction).catch((err) => console.error(err)); // 加入队列
    return oldInteractions.concat(updateInteraction);
}





// 事件初始化
export function useInitEvent() {
    const setInteraction = useSetRecoilState(interactions);

    const handleEventInit = useCallback((payload: { components: any; layers: any; isContainerSubScreen: any; }) => {
        setInteraction((inits) => eventInit(payload, inits))
    }, [setInteraction]);

    return handleEventInit;
}


function eventInit(payload: { components: any; layers: any; isContainerSubScreen: any; }, states: Interaction[]) {
    const { components, layers, isContainerSubScreen } = payload;
    const interactions = getInteractions(components, layers, isContainerSubScreen);
    const result = interactions.reduce((all: any[], item: { id: any; state: any; controllers: any; }) => {
        const exist = all.find((o) => o.id === item.id);

        if (exist) {
            exist.state = exist.state.show === false ? { ...item.state, show: false } : item.state;
            if (Array.isArray(exist.controllers)) {
                exist.controllers = exist.controllers.concat(item.controllers);
            }
            return all;
        }
        return all.concat(item);
    }, [states]);

    return result;
}

export const getInteractions = (components: any[], layers: any[], isContainerSubScreen: any) => {
    if (!components) {
        return [];
    }

    const getInitState = (layers: any[]) =>
        layers.reduce((all, item) => {
            if (isGeneralPanel(item.id)) {
                // 动态面板特殊处理，将所有的动态面板都存进interactions中
                all.push({
                    id: item.id,
                    state: {
                        show: !item.hideDefault,
                        unmount: true,
                    },
                    activeState: {},
                    controllers: [],
                });
            } else if (isContainer(item.id)) {
                all.push({
                    id: item.id,
                    state: {
                        show: !item.hideDefault,
                        unmount: true,
                    },
                    activeState: {},
                    controllers: [],
                });
            } else if (item.hideDefault) {
                all.push({
                    id: item.id,
                    state: {
                        show: false,
                        unmount: true,
                    },
                    isContainer: isContainerSubScreen,
                    activeState: {},
                    controllers: [],
                });
            }

            if (isGroup(item.id)) {
                all = all.concat(getInitState(item.components));
            } else if (isComponent(item.id)) {
                const children = components.filter((d: { parent: any; }) => d.parent === item.id);

                if (children && children.length > 0) {
                    const defaultHideChildren = children.filter(
                        (d: { config: any; }) => getValueFromConfig(d.config, [0], 'show') === false,
                    );
                    if (defaultHideChildren.length > 0) {
                        all.push(
                            ...defaultHideChildren.map((d: { id: any; }) => ({
                                id: d.id,
                                state: {
                                    show: false,
                                    unmount: true,
                                },
                                activeState: {},
                                controllers: [],
                            })),
                        );
                    }
                }
            }

            return all;
        }, []);

    const initState = getInitState(layers);
    return components.reduce((result: any[], current: any) => {
        if (current.config) {
            const configs = reduceConfig(current.config);
            const { interaction } = configs;
            const controller = current.id;
            if (interaction && controller) {
                const { events } = interaction;
                if (events) {
                    Object.keys(events).forEach((key) => {
                        const event = events[key];
                        const id = getId(event.component);
                        if (id) {
                            const index = result.findIndex((o: { id: any; }) => o.id === id);
                            const animation = getAnimation({
                                type: event.animationName,
                                duration: event.duration,
                            });
                            if (index < 0) {
                                result = result.concat([
                                    {
                                        id,
                                        state: {
                                            show: true,
                                        },
                                        activeState: {
                                            animation: {
                                                key: 'show',
                                                ...animation,
                                            },
                                        },
                                        controllers: [controller],
                                    },
                                ]);
                            } else {
                                result[index] = {
                                    ...result[index],
                                    activeState: {
                                        animation: {
                                            key: 'show',
                                            ...animation,
                                        },
                                    },
                                    controllers: result[index].controllers.includes(controller)
                                        ? result[index].controllers
                                        : result[index].controllers.concat([controller]),
                                };
                            }
                        }
                    });
                }
            }
        }

        result.forEach((o: { id: string | number; controllers: any; }) => {
            if (!window.interactionControllers) window.interactionControllers = {};
            window.interactionControllers[o.id] = o.controllers;
        });

        return result;
    }, initState);
};