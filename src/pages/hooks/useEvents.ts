import { isRef, isGroup, isComponent, isPanel, getId } from '@lidakai/utils';
import { useMemo } from 'react';
import { interactions } from '@/dataStore/interactions';
import { useRecoilValue } from 'recoil';


export function useEvents(eventType: "group" | "component" | "panel" | "ref", id: string | number) {

    const interaction = useRecoilValue(interactions);
    const eventData = useMemo(() => {
        if (Array.isArray(interaction)) {
            switch (eventType) {
                case "group":
                    return interaction.filter(i => isGroup(i.component as string) && getId(i.component) === id)
                    break;
                case "component":
                    return interaction.filter(i => isComponent(i.component as string) && getId(i.component) === id)
                    break;
                case "panel":
                    return interaction.filter(i => isPanel(i.component as string) && getId(i.component) === id)
                    break;
                case "ref":
                    return interaction.filter(i => isRef(i.component as string) && getId(i.component) === id)
                    break;
                default:
                    break;
            }
        }

        return null;

    }, [eventType, interaction, id]);

    return Array.isArray(eventData) ? eventData : [];
}


export interface MinAnimation {
    show: boolean;
    unmount: boolean;
    delay: number;
    type: string;
    timingFunction: string;
    duration: number;
}