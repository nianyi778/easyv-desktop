import { Interaction } from '@/type/Interactions.type';
import { isRef, isGroup, isComponent, isPanel, getId } from '@lidakai/utils';
import { useEffect, useMemo, useState } from 'react';
import { queueWorker } from '@/utils/events';

export function useEvents(eventType: "group" | "component" | "panel" | "ref", id: string | number) {
    const [event, setEvent] = useState<Interaction>();

    useEffect(() => {
        const t = queueWorker.addEventListener((args) => {
            args && setEvent(args);
        })

        return () => {
            queueWorker.removeEventListener(t);
            setEvent(undefined);
        }
    }, []);


    const eventData = useMemo(() => {
        console.log(event, '-=-=event');
        if (event && id === getId(event.component)) {
            switch (eventType) {
                case "group":
                    return isGroup(event.component as string) ? event : null;
                    break;
                case "component":
                    return isComponent(event.component as string) ? event : null;
                    break;
                case "panel":
                    return isPanel(event.component as string) ? event : null;
                    break;
                case "ref":
                    return isRef(event.component as string) ? event : null;
                    break;
                default:
                    break;
            }
        }

        return null;

    }, [eventType, event, id]);

    return eventData
}


export interface MinAnimation {
    show: boolean;
    unmount: boolean;
    delay: number;
    type: string;
    timingFunction: string;
    duration: number;
}