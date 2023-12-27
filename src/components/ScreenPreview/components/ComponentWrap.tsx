import Component from "./Component";
import { components } from '@/dataStore'
import { useRecoilValue } from 'recoil';

export default function ComponentWrap({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];

    const children = {};

    if (!component) {
        return null;
    }

    return <Component id={id} component={component} />
}