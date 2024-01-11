import Component from "./Component";
import { components } from '@/dataStore'
import { useEvents } from "@/pages/hooks";
import { useRecoilValue } from 'recoil';

export default function ComponentWrap({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];
    const [comEvent] = useEvents('component', id);

    if (!component) {
        return null;
    }
    const children = Array.isArray(component.children) ? component.children.map(c => componentsById[c]) : undefined;

    return <Component id={id} component={component} event={comEvent} children={children} />
}