import { ComponentRels, Layer } from "@/type/screen.type";
import { components, panels, comContainers } from '@/dataStore'
import { useRecoilValue } from 'recoil';
import { isComponent, isContainer, isPanel, reduceCompute, SizeType } from "@/utils";
import { getId, getComponentDimension } from "@easyv/admin-utils";
import Animation from "@/components/Animation/AutoAnimation";
import Group from "./Group";
import { useEvents } from '@/pages/hooks';
import { useMemo } from "react";
import { deepLayersComponents } from '@/utils/component';

interface GroupWrapType {
    id: string;
    hideDefault?: boolean;
    components: Layer[];
    componentRels?: ComponentRels[];
    containerItemData?: unknown;
    config: {
        opacity: number
    };
    containerIndex?: number;
}

export default function GroupWrap({ id, components: layers, config, hideDefault, containerIndex, containerItemData, componentRels }: GroupWrapType) {
    const { opacity } = config;
    const componentsById = useRecoilValue(components);
    const panelsById = useRecoilValue(panels);
    const comContainersById = useRecoilValue(comContainers);

    const groupEvent = useEvents('group', id);

    const sizeArray = useMemo(() => {
        // components
        const allLayerList = deepLayersComponents(layers);

        return allLayerList.map(layer => {
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

    }, [layers, comContainersById, panelsById, componentsById]);

    const { width, height, left, top, } = reduceCompute(sizeArray as SizeType[]);

    const { iState,
        iActiveState } = groupEvent || {};

    const defaultState = {
        show: !hideDefault,
    };

    return <Animation id={id}
        iState={iState || defaultState}
        iActiveState={iActiveState}
        width={width}
        left={left}
        top={top}
        height={height}
    >
        {/* <div id={id} className=" absolute" style={{
            width: width,
            height: height,
            left: -1 * left,
            top: -1 * top,
            opacity: opacity
        }}> */}

        <Group width={width} height={height}
            left={left} top={top}
            layers={layers}
            containerIndex={containerIndex}
            componentRels={componentRels}
            containerItemData={containerItemData} />
        {/* </div> */}
    </Animation>


}