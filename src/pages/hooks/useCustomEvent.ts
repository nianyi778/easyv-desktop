
import { useCallback, useEffect } from 'react';
import { Interaction } from '@/type/Interactions.type';
import { queueWorker } from '@/utils/events';
import { getId } from '@lidakai/utils';
import { panels, interactions } from '@/dataStore';
import { useRecoilValue, useRecoilState } from 'recoil';
import { ActionType, AnimateType } from '@/constants';
import { mergeInteraction } from './useInteraction';
import { isBoolean, isNumber } from 'lodash-es';

export function useCustomEvent(id: string | number) {
    const [interaction, setInteraction] = useRecoilState(interactions);
    const panelsById = useRecoilValue(panels);

    const setIndexEvent = useCallback((event: Interaction) => {
        function stateSwitchPanel(stateId: number, event: Interaction, originShow: boolean) {
            // 切换面板状态
            const { controllers, _from } = event;

            const panelConfig = getDefaultPanelConfig({
                stateId: stateId,
                animateType: AnimateType.opacity,
                panelId: id as string,
                type: event.type,
                show: originShow,
                config: { controllers, _from, }
            });
            setInteraction((init) => {
                const a = mergeInteraction(init, panelConfig);
                return a;
            })
        }

        const panel = panelsById[getId(id)];
        if (event && event?.dynamicData && panel) {
            const { states = [] } = panel;
            try {
                const i = +event?.dynamicData;
                if (isNumber(i) && states[i - 1]) {
                    const panelState = interaction.find((d) => d.component === id);
                    let show = true;
                    if (panelState && isBoolean(panelState?.state?.show)) {
                        show = panelState.state.show
                    }
                    stateSwitchPanel(states[i - 1], event, show)
                }
            } catch (e) {
                console.error(`panel ${id} 自定义事件执行失败`, e);
            }

        }
    }, [id, setInteraction, interaction]);

    useEffect(() => {
        const t = queueWorker.addEventListener((args) => {
            if (args && args.component === id) {
                switch (args.type) {
                    case ActionType.SetIndex:
                        setIndexEvent(args);
                        break;
                    default:
                        console.log(args, '自定义事件');
                        break;
                }
            }
        })

        return () => {
            queueWorker.removeEventListener(t);
        }
    }, [id]);


    const switchPanelState = useCallback((id: string) => {
        const panelId = getId(id);
        const panel = panelsById[panelId];
        if (panel) {
            const { states = [], config } = panel;
            const { animateType, animationDuration } = config;
            if (Array.isArray(states) && states.length > 1) {
                const panelState = interaction.find((d) => d.component === id);
                if (panelState && panelState.state.show) {
                    const current = panelState.state.stateId;
                    let currentIndex = states.findIndex((d) => d === current);
                    currentIndex = currentIndex === -1 ? 0 : currentIndex;
                    const nextStateId = states[(currentIndex + 1) % states.length];
                    const panelConfig = getDefaultPanelConfig({
                        stateId: nextStateId,
                        animateType,
                        panelId: id,
                        show: true,
                        type: ActionType.SwitchState,
                        duration: animationDuration * 1000
                    });

                    setInteraction((init) => {
                        const a = mergeInteraction(init, panelConfig);
                        console.log(a, '=====update');
                        return a;
                    })
                } else {
                    const panelConfig = getDefaultPanelConfig({
                        stateId: states[0],
                        animateType,
                        show: false,
                        type: ActionType.SwitchState,
                        panelId: id,
                        duration: animationDuration * 1000
                    });
                    setInteraction((init) => {
                        const a = mergeInteraction(init, panelConfig);
                        console.log(a, '=====add');
                        return a
                    })
                }

            }
        }
    }, [panelsById, interaction]);

    return {
        switchPanelState,
    };
}




export const getDefaultPanelConfig = function ({ stateId, type, panelId, show, animateType = AnimateType.opacity, config = {}, duration = 600 }: {
    stateId: number;
    panelId: string;
    show: boolean;
    animateType: AnimateType;
    config?: Record<string, unknown>;
    duration?: number;
    type?: ActionType; // 事件类型
}): Interaction {
    return {
        state: {
            show: show,
            stateId: stateId,
            unmount: false,
        },
        component: panelId,
        type: type as ActionType,
        animation: {
            duration: animateType === AnimateType.none ? 0 : duration,
            type: animateType,
            timingFunction: 'ease',
            delay: 0,
        },
        controllers: [panelId],
        _from: {
            componentId: panelId
        },
        activeState: {
            animation: {
                key: animateType,
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
                config: {
                    duration: animateType === AnimateType.none ? 0 : duration,
                    type: animateType,
                    timingFunction: 'ease',
                    delay: 0,
                },
            },
        },
        ...config
    }
}