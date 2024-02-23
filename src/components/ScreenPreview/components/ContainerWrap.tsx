import ContainerAnimation from "./ContainerAnimation"
import { useRecoilValue } from 'recoil';
import { comContainers, screens, components, sources, filters } from '@/dataStore'
import { getId, getComponentDimension, reduceConfig } from "@easyv/admin-utils";
import { ComContainerReduceConfig } from "@/type/com-container.type";
import { getTemplateSize } from "@/utils/comContainer";
import { useMemo } from "react";
import { getDataConfig } from "@/utils/source";
import useDataGet from "@/pages/hooks/useDataGet";
import { TransformFilterType } from "@/type/screen.type";
// import ContainerSize from './ContainerSize';

export default function ContainerWrap({ id }: { id: string }) {
    const containerById = useRecoilValue(comContainers);
    const screensById = useRecoilValue(screens);
    const componentsById = useRecoilValue(components);
    const container = containerById[getId(id)];
    const sourcesById = useRecoilValue(sources);
    const filterList = useRecoilValue(filters);

    if (!container) {
        return null;
    }
    const containerScreen = screensById[container.subScreenId];

    if (!containerScreen) {
        //  找不到子屏也别浪费我cpu了。早点return
        return null;
    }
    const containerComponents = Array.isArray(containerScreen.components) ? containerScreen.components.map(c => componentsById[c]).filter(d => d) : [];

    if (!containerComponents.length) {
        // 子屏没组件也一样，没啥意义，为社会主义四个现代化做贡献吧。
        return null;
    }

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
        dataConfig
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

