import { useRecoilValue } from 'recoil';
import { components } from '@/dataStore';
import { getComponentConfig } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';

export default function Component({ id }: { id: number }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];

    if (!component) {
        return null;
    }
    const { uniqueTag, config } = component;
    const { chart } = getComponentConfig(config);
    const { dimension } = chart;
    const { chartDimension, chartPosition } = dimension;
    const { width, height } = chartDimension;
    const { left, top } = chartPosition;

    return <div
        style={{
            width,
            height,
            left, top
        }}
        className={`absolute`}
    >
        <EasyVComponent
            uniqueTag={uniqueTag}
            id={id} base={component.base} config={config} left={left} top={top} width={width} height={height} />
    </div>
}