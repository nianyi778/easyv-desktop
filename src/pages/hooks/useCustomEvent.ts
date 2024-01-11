
import { useEffect, useState } from 'react';
import { Interaction } from '@/type/Interactions.type';
import { queueWorker } from '@/utils/events';
import { getId } from '@lidakai/utils';
import { panels, interactions } from '@/dataStore';
import { useRecoilValue, useRecoilState } from 'recoil';
import { ActionType, AnimateType } from '@/constants';
import { mergeInteraction } from './useInteraction';
import { isNumber } from 'lodash-es';

export function useCustomEvent(id: string | number) {
    const [event, setEvent] = useState<Interaction>();
    const [interaction, setInteraction] = useRecoilState(interactions);
    const panelsById = useRecoilValue(panels);

    useEffect(() => {
        const t = queueWorker.addEventListener((args) => {
            if (args && args.component === id) {
                setEvent(args);
            }
        })

        return () => {
            queueWorker.removeEventListener(t);
            setEvent(undefined);
        }
    }, [id]);




    function switchPanelState(id: string) {
        const panelId = getId(id);
        const panel = panelsById[panelId];

        if (panel) {
            const { states = [], config } = panel;
            const { animateType, animationDuration } = config;
            if (Array.isArray(states) && states.length > 1) {
                const panelState = interaction.find((d) => getId(d.component) === id);
                if (panelState && panelState.state.show) {
                    const current = panelState.state.stateId;
                    let currentIndex = states.findIndex((d) => d === current);
                    currentIndex = currentIndex === -1 ? 0 : currentIndex;
                    const nextStateId = states[(currentIndex + 1) % states.length];

                    const panelConfig = getDefaultPanelConfig({
                        stateId: nextStateId,
                        animateType,
                        panelId: id,
                        type: ActionType.AutoSwitchState,
                        duration: animationDuration * 1000
                    });
                    setInteraction((init) => mergeInteraction(init, panelConfig))
                } else {
                    const panelConfig = getDefaultPanelConfig({
                        stateId: states[0],
                        animateType,
                        type: ActionType.AutoSwitchState,
                        panelId: id,
                        duration: animationDuration * 1000
                    });
                    setInteraction((init) => mergeInteraction(init, panelConfig))
                }

            }
        }

    }


    useEffect(() => {
        function stateSwitchPanel(stateId: number, event: Interaction) {
            // 切换面板状态
            const { controllers, _from } = event;

            const panelConfig = getDefaultPanelConfig({
                stateId: stateId,
                animateType: AnimateType.opacity,
                panelId: id as string,
                type: event.type,
                config: { controllers, _from, }
            });
            setInteraction((init) => mergeInteraction(init, panelConfig))
        }
        const panel = panelsById[id];
        if (event && event?.dynamicData && panel) {
            const { states = [] } = panel;
            try {
                const i = +event?.dynamicData;
                if (isNumber(i) && states[i - 1]) {
                    stateSwitchPanel(states[i - 1], event)
                }
            } catch (e) {
                console.error(`panel ${id} 自定义事件执行失败`, e);
            }

        }
    }, [event, id, panelsById, setInteraction]);



    return {
        switchPanelState,
        event
    };
}




export const getDefaultPanelConfig = function ({ stateId, type, panelId, animateType, config = {}, duration = 600 }: {
    stateId: number;
    panelId: string;
    animateType: string;
    config?: Record<string, unknown>;
    duration?: number;
    type: ActionType; // 事件类型
}): Interaction {
    return {
        state: {
            show: true,
            stateId: stateId,
            unmount: false,
        },
        component: panelId,
        type: type,
        animation: {
            duration: animateType === 'none' ? 0 : duration,
            type: AnimateType.opacity,
            timingFunction: 'ease',
            delay: 0,
        },
        controllers: [panelId],
        _from: {
            componentId: panelId
        },
        activeState: {
            animation: {
                key: ActionType.Show,
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
                config: {
                    duration: animateType === 'none' ? 0 : duration,
                    type: AnimateType.opacity,
                    timingFunction: 'ease',
                    delay: 0,
                },
            },
        },
        ...config
    }
}