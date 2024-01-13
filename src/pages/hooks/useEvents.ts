import { isRef, isGroup, isComponent, isPanel } from '@lidakai/utils';
import { useMemo } from 'react';
import { interactions } from '@/dataStore/interactions';
import { useRecoilValue } from 'recoil';

export function useEvents(eventType: "group" | "component" | "panel" | "ref", id?: string | number) {

    const interaction = useRecoilValue(interactions);
    // console.log(interaction, 'interaction');
    const eventData = useMemo(() => {
        if (Array.isArray(interaction)) {
            switch (eventType) {
                case "group":
                    return interaction.find(i => isGroup(i.component as string) && i.component === id)
                    break;
                case "component":
                    return interaction.find(i => isComponent(i.component as string) && i.component === id)
                    break;
                case "panel":
                    return interaction.find(i => isPanel(i.component as string) && i.component === id)
                    break;
                case "ref":
                    return interaction.find(i => isRef(i.component as string) && i.component === id)
                    break;
                default:
                    break;
            }
        }

        return null;

    }, [eventType, interaction, id]);
    return eventData ? eventData : null;
}


export interface MinAnimation {
    show: boolean;
    unmount: boolean;
    delay: number;
    type: string;
    timingFunction: string;
    duration: number;
}