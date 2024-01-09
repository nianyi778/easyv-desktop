import { interactions } from '@/dataStore';
import { Interaction } from '@/type/Interactions.type';
import { isRef, isGroup, isComponent, isPanel } from '@lidakai/utils';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

export function useEvents(type: "group" | "component" | "panel" | "ref") {
    const interaction = useRecoilValue(interactions);
    console.log(interaction, 'interaction');

    const events = useMemo(() => {
        let eventData: Interaction[] = [];
        switch (type) {
            case "group":
                eventData = interaction.filter(i => isGroup(i.component as string))
                break;
            case "component":
                eventData = interaction.filter(i => isComponent(i.component as string))
                break;
            case "panel":
                eventData = interaction.filter(i => isPanel(i.component as string))
                break;
            case "ref":
                eventData = interaction.filter(i => isRef(i.component as string))
                break;
            default:
                break;
        }
        return eventData;
    }, [interaction, type]);


    return events;
}