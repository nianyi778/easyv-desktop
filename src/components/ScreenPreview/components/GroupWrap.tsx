import { Layer } from "@/type/screen.type";
import { components, panels, comContainers } from '@/dataStore'
import { useRecoilValue } from 'recoil';
import { isComponent, isContainer, isPanel, reduceCompute, SizeType } from "@/utils";
import { getId, getComponentDimension } from "@lidakai/utils";
import Group from "./Group";
import { useEvents } from '@/pages/hooks';
interface GroupWrapType {
    id: string;
    components: Layer[];
    config: {
        opacity: number
    }
}

export default function GroupWrap({ id, components: layers, config }: GroupWrapType) {
    const { opacity } = config;
    const componentsById = useRecoilValue(components);
    const panelsById = useRecoilValue(panels);
    const comContainersById = useRecoilValue(comContainers);

    const groupEvent = useEvents('group', id);

    const sizeArray = layers.map(layer => {
        if (isComponent(layer.id as number)) {
            const com = componentsById[layer.id];
            const dimension = com && getComponentDimension(com.config);
            if (dimension) {
                return {
                    width: dimension.width,
                    height: dimension.height,
                    top: dimension.top,
                    left: dimension.left
                }
            }
        }
        if (isPanel(layer.id as string)) {
            const panel = panelsById[getId(layer.id)];
            if (panel && panel.config) {
                const { width, height, left, top } = panel.config;
                return {
                    width,
                    height,
                    left,
                    top
                }
            }
        }
        if (isContainer(layer.id as string)) {
            const data = comContainersById[getId(layer.id)];
            const dimension = data && getComponentDimension(data.config);
            if (dimension) {
                return {
                    width: dimension.width,
                    height: dimension.height,
                    top: dimension.top,
                    left: dimension.left
                }
            }
        }
        return null;
    }).filter(d => d);
    const { width, height, left, top, minLeft, minTop } = reduceCompute(sizeArray as SizeType[]);

    return <div id={id} className=" absolute" style={{
        width: width,
        height: height,
        left: left,
        top: top,
        opacity: opacity
    }}>
        <div className=" absolute" style={{
            left: -1 * minLeft,
            top: -1 * minTop
        }}>
            <Group width={width} event={groupEvent} height={height} layers={layers} />
        </div>
    </div>
}