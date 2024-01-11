import { Interaction } from "@/type/Interactions.type";
import { useCallback } from "react";
import { useSetRecoilState } from 'recoil';
import { interactions } from "@/dataStore";
import { ActionType } from '@/constants/defaultConfig';
import { isUndefined } from "lodash-es";
// import { q } from '@/utils/events';

/**
 * @description 统计事件
 * */
export function useInteraction() {
    const setInteraction = useSetRecoilState(interactions);
    const updateInteraction = useCallback((interaction: Interaction) => {
        interaction && setInteraction((inits) => mergeInteraction(inits, interaction));
    }, []);
    return updateInteraction;
}

type StateKeys = keyof Interaction['state'];

const defaultState = {
    unmount: false,
    show: true
}

function mergeInteraction(oldInteractions: Interaction[], newInteraction: Interaction): Interaction[] {
    const eventState = oldInteractions.find((d: Interaction) => {
        const { dynamicData, component } = newInteraction;
        if (dynamicData) {
            return (d.id || d.component) === component && dynamicData === d.dynamicData;
        }
        return (d.id || d.component) === component;
    });
    const { component, type, dynamicData, state = defaultState, activeState = {}, controllers } = newInteraction;
    const { unmount = defaultState.unmount } = state as Interaction['state']; // 是否卸载，默认false 未卸载
    let updateInteraction = { ...newInteraction, id: component };
    if (eventState) {
        return oldInteractions.reduce<Interaction[]>((acc, interaction) => {
            const isCurrent =
                interaction.component === component // 组件id
                && interaction.type === type // 类型相同
                && retentionType.includes(interaction.type) // 且属于白名单内
                && (interaction.dynamicData ? interaction.dynamicData === dynamicData : true); // 兼容自定义代码块
            if (isCurrent) {
                // 同一个被控组件，且类型相同
                const newState = Object.keys(state).reduce<Record<string, unknown>>((obj, key) => {
                    if (state[key as StateKeys] === '$not') {
                        obj[key] = !interaction.state[key as StateKeys];
                    } else {
                        obj[key] = !isUndefined(state[key as StateKeys]) ? state[key as StateKeys] : interaction.state[key as StateKeys];
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
                // q.push(mergeInteraction).catch((err) => console.error(err)); // 加入队列
                return acc.concat(mergeInteraction);
            }
            return acc.concat(interaction);
        }, []);
    } else if (state.show === '$not') {
        updateInteraction = { ...updateInteraction, state: { show: false, unmount } }
        // q.push(updateInteraction).catch((err) => console.error(err)); // 加入队列
        return oldInteractions.concat(updateInteraction)
    };

    // q.push(newInteraction).catch((err) => console.error(err)); // 加入队列
    return oldInteractions.concat(updateInteraction);
}


/**
 * @description 允许内存常驻类型
 * */
export const retentionType = [
    ActionType.ShowHide,
]