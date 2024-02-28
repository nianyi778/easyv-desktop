import ContainerAnimation from "./ContainerAnimation"
import { useRecoilValue } from 'recoil';
import { sources, filters, callbackState } from '@/dataStore'
import { getComponentDimension, reduceConfig } from "@easyv/admin-utils";
import { ComContainerReduceConfig } from "@/type/com-container.type";
import { getTemplateSize } from "@/utils/comContainer";
import { useMemo } from "react";
import { getDataConfig } from "@/utils/source";
import useDataGet from "@/pages/hooks/useDataGet";
import { TransformComponentContainerType, TransformComponentType, TransformFilterType } from "@/type/screen.type";

export default function ContainerWrap({ id, containerComponents, container }: { id: string; containerComponents: TransformComponentType[]; container: TransformComponentContainerType }) {
    const sourcesById = useRecoilValue(sources);
    const filterList = useRecoilValue(filters);
    const callback = useRecoilValue(callbackState);


    const containerComponentsSize = containerComponents.map(d => {
        const { width, height, left, top } = getComponentDimension(d.config);
        return {
            width,
            height,
            left,
            top,
        }
    })
    const { dataConfigs, dataType, filters: conFilters, componentRels } = container;

    const dataConfig = getDataConfig({
        dataConfigs,
        dataType,
        sourcesById
    });
    const filterContents = conFilters.filter(c => c.enable).map(d => filterList.find(f => f.id === d.filterId)).filter(f => f) as TransformFilterType[];

    const comData = useDataGet({
        filters: filterContents,
        dataConfig,
        callbackValue: {}
    });

    const containerData = useMemo(() => {
        return Array.isArray(comData) ? comData : [];
    }, [comData]);

    const { width, height, left, top } = getComponentDimension(container.config);
    const config = reduceConfig(container.config) as ComContainerReduceConfig;

    const { style } = config;
    const {
        useBackground,
        background,
        backgroundColor
    } = style;
    const styles = useBackground ? {
        'backgroundImage': `url('${window.appConfig.ASSETS_URL}${background}')`,
        "backgroundPosition": "center center",
        "backgroundRepeat": 'no-repeat',
        "backgroundSize": "cover"
    } : {
        backgroundColor
    }
    const { autoLayout, scrollSettings } = config;

    // 计算出单个container的有效大小
    const size = getTemplateSize(
        containerComponentsSize
    )

    return <div
        id={id}
        className=" absolute overflow-hidden"
        style={{
            width,
            height,
            left,
            top,
        }}>
        <ContainerAnimation boxEffectiveSize={size} width={width} componentRels={componentRels} height={height} subScreenId={container.subScreenId} bgStyle={styles} containerData={containerData} containerId={id} autoLayoutConfig={autoLayout} scrollSettingsConfig={scrollSettings} />
    </div >
}

