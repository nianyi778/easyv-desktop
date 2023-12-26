import { useRecoilValue } from 'recoil';
import { components } from '@/dataStore';
import { getComponentDimension } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';

export default function Component({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];

    if (!component) {
        return null;
    }
    const { uniqueTag, config, name, dataConfigs, events } = component;
    const { width, height, left, top } = getComponentDimension(config);

    const { data } = dataConfigs['static'];

    return <div
        style={{
            width,
            height,
            left: left, top: top,
        }}
        className={`absolute pointer-events-none`}
    >
        <div
            className={`absolute`}
            style={{
                left: -1 * left, top: -1 * top,
            }}>
            <EasyVComponent
                uniqueTag={uniqueTag}
                data={data}
                id={id} base={component.base} name={name} events={events} config={config} left={left} top={top} width={width} height={height} />
        </div>
    </div>
}