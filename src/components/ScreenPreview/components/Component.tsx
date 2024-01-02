import { getComponentDimension } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';
import { TransformComponentType } from '@/type/screen.type';
import { useEffect } from 'react';

export default function Component({ id, component, children = [] }: { id: number; component: TransformComponentType; children?: TransformComponentType[] }) {

    const { uniqueTag, config, name, dataConfigs, events, autoUpdate } = component;
    const { width, height, left, top } = getComponentDimension(config);

    useEffect(() => {
        // console.log('auto', autoUpdate,id);
    }, [autoUpdate])

    const { data } = dataConfigs['static'];
    console.log(children, 'children');

    return <div
        id={id + ''}
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