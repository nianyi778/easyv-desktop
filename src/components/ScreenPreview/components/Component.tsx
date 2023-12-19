import { useRecoilValue } from 'recoil';
import { components } from '@/dataStore'

export default function Component({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];
    console.log(component);
    if (!component) {
        return null;
    }

    return <div>{component.name}</div>
}