import { isRef, isGroup, isComponent, isPanel } from '@easyv/admin-utils';
import { useMemo } from 'react';
import { interactions } from '@/dataStore/interactions';
import { useRecoilValue } from 'recoil';

export function useEvents(eventType: "group" | "component" | "panel" | "ref", id?: string | number) {

    const interaction = useRecoilValue(interactions);
    // console.log(JSON.parse(JSON.stringify(interaction)), 'new-interaction-list');
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


    if (eventData) {
        const iState = eventData && eventData.state;
        const iActiveState = eventData && eventData.activeState;
        const bindedInteractionState = interaction
            .filter((o) => o.controllers && o.controllers.includes(id as string | number))
            .map((o) => ({ id: o.id, state: o.state, activeState: o.activeState }));

        return {
            iState,
            iActiveState,
            bindedInteractionState,
        };
    }

    return null;
}

export interface MinAnimation {
    show: boolean;
    unmount: boolean;
    delay: number;
    type: string;
    timingFunction: string;
    duration: number;
}