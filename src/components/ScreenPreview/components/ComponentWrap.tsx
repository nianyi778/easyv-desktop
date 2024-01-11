import Component from "./Component";
import { components } from '@/dataStore'
import { useRecoilValue } from 'recoil';

export default function ComponentWrap({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];


    if (!component) {
        return null;
    }
    const children = Array.isArray(component.children) ? component.children.map(c => componentsById[c]) : undefined;

    return <Component id={id} component={component} children={children} />
}