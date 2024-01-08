import { Interaction } from "@/type/Interactions.type";
import { useCallback } from "react";
import { interactions } from '@/dataStore';
import { useSetRecoilState } from 'recoil';
/**
 * @description 统计事件
 * */
export function useInteraction() {
    const setInteraction = useSetRecoilState(interactions);
    const updateInteraction = useCallback((interaction: Interaction) => {
        console.log(interaction, 'interaction');
        interaction && setInteraction((inits) => inits.concat(interaction))
    }, [setInteraction])


    return updateInteraction;

}
