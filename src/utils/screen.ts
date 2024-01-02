import fs from 'fs';
import { checkFilePath } from './file';
import path from 'path';
import { ScreenJsonType, ScreenPreviewType, ComponentConfig, TransformComponentContainerType, SourceConfig, TransformPanelType, TransformScreenType, TransformContainerType, TransformComponentType, ComponentContainerConfig, ContainerConfig, ScreenType, PanelConfig } from '@/type/screen.type';

/**
 * @description 获取当前本地存在的所有大屏列表
 * @returns 大屏列表json
*/
export function getScreens() {
    const filePath = checkFilePath('/screenConfig/', false);
    const files = fs.readdirSync(filePath);
    const screens: any[] = [];
    files.filter(d => d).forEach(file => {
        try {
            const result = fs.readFileSync(path.join(filePath, file), 'utf-8');
            screens.push(JSON.parse(result))
        } catch (e) {
            console.log(e, file);
        }
    })
    return screens;
}


/**
 * @description 获取大屏数据
 * @param id  The id of the screen
 * @returns 返回单个大屏json文件
 * */
export function getScreenData(id: string | number) {
    const filePath = checkFilePath('/screenConfig/' + id + '.json');
    let data;
    if (filePath && id) {
        try {
            const result = fs.readFileSync(path.join(filePath), 'utf-8');
            data = JSON.parse(result);
        } catch (e) {
            console.log(e);
        }
    }
    return data;
}

/**
 * @description 维护组件children 信息
 * */
function maintainComponentChildren(components: TransformComponentType[]): TransformComponentType[] {
    return components.reduce((all, cur) => {
        if (cur.parent) {
            const index = all.findIndex(i => i.id === cur.parent);
            if (~index) {
                all[index].children = Array.isArray(all[index].children) ? all[index].children?.concat(cur.id) : [cur.id]
            }
        }
        return all;
    }, components);
}

/**
 * @description 清洗从本地json 读出的数据，处理成标准数据结构
 * @returns 标准大屏数据
 * @param data  本地json 读出的数据
*/
export function cleanLargeScreenData(data: ScreenJsonType): ScreenPreviewType {
    const {
        screenConfig,
        containersConfig = [],
        panelConfig,
        sourceConfig,
        filterConfig,
        componentContainerConfig = [],
        componentsConfig,
    } = data;

    let filters = filterConfig.map(f => ({
        ...f,
        callbackKeys: JSON.parse(f.callbackKeys)
    }));
    let componentContainers = componentContainerConfig.map(c => transformComponentContainer(c.componentContainer));
    let components = componentsConfig.map(c => transformComponent(c));
    let containers = containersConfig.map(c => transformContainer(c));
    let panel = panelConfig.map(p => transformPanel(p));
    let source = sourceConfig.map(p => transformSource(p));

    components = maintainComponentChildren(components);

    let screens = Array.isArray(screenConfig) ? screenConfig : [screenConfig];

    const screenSerialize = screens.map(s => transformScreen(s));


    const stateConfigs = panelConfig.reduce<Omit<ScreenJsonType, 'info'>[]>((all, cur) => {
        return all.concat(cur.stateConfig);
    }, []);
    const panelScreens = reduceScreens(stateConfigs);

    const containerConfigs = componentContainerConfig.reduce<Omit<ScreenJsonType, 'info'>[]>((all, cur) => {
        return all.concat(cur.subScreenConfig);
    }, []);
    const containerScreens = reduceScreens(containerConfigs);

    return {
        filters: filters.concat(panelScreens.filters).concat(containerScreens.filters),
        screens: screenSerialize.concat(panelScreens.screens).concat(containerScreens.screens),
        source: source.concat(panelScreens.source).concat(containerScreens.source),
        panel: panel.concat(panelScreens.panel).concat(containerScreens.panel),
        containers: containers.concat(panelScreens.containers).concat(containerScreens.containers),
        components: components.concat(panelScreens.components).concat(containerScreens.components),
        componentContainers: componentContainers.concat(panelScreens.componentContainers).concat(containerScreens.componentContainers)
    };
}


function reduceScreens(data: Omit<ScreenJsonType, 'info'>[]) {
    const screenData = Array.isArray(data) ? data : [];
    return screenData.reduce<ScreenPreviewType>((all, cur) => {
        const state = cleanLargeScreenData(cur);
        all.filters = all.filters.concat(state.filters);
        all.screens = all.screens.concat(state.screens);
        all.source = all.source.concat(state.source);
        all.panel = all.panel.concat(state.panel);
        all.containers = all.containers.concat(state.containers);
        all.components = all.components.concat(state.components);
        all.componentContainers = all.componentContainers.concat(state.componentContainers);
        return all;
    }, {
        filters: [],
        screens: [],
        source: [],
        panel: [],
        containers: [],
        components: [],
        componentContainers: []
    });
}


function transformComponentContainer(comContainer: ComponentContainerConfig['componentContainer']): TransformComponentContainerType {
    const { id, name, config, autoUpdate, dataFrom, staticData, dataConfig, subScreenId, useFilter } = comContainer;
    const dataConfigs = getDataConfigs({ dataConfig, staticData })

    return {
        id, name,
        config: JSON.parse(config),
        autoUpdate: JSON.parse(autoUpdate),
        dataFrom,
        dataConfigs,
        subScreenId,
        useFilter
    }
}

function transformSource(sourceConfig: SourceConfig) {
    const { name, type, config, dataId } = sourceConfig;
    return {
        name, type, dataId,
        config: JSON.parse(config),
    }
}

function transformPanel(panelConfig: PanelConfig): TransformPanelType {
    const { id, name, screenId, type, states, updatedAt, uuid, createdAt, config } = panelConfig.config;
    return {
        id, name, screenId,
        type,
        uuid,
        createdAt,
        updatedAt,
        states: JSON.parse(states),
        config: JSON.parse(config),
    }
}

function transformScreen(screenConfig: ScreenType): TransformScreenType {
    const { id, name, config, layers, components, uniqueTag } = screenConfig;

    return {
        id, name,
        config: JSON.parse(config),
        layers: JSON.parse(layers),
        components: JSON.parse(components),
        uniqueTag
    }
}

function transformContainer(containerConfig: ContainerConfig): TransformContainerType {
    const { id, name, subScreenId, autoUpdate, staticData, events, filters, screenId, useFilter, enable, dataConfig } = containerConfig;
    const dataConfigs = getDataConfigs({ dataConfig, staticData })
    return {
        id, name,
        autoUpdate: JSON.parse(autoUpdate),
        events: JSON.parse(events),
        filters: JSON.parse(filters),
        subScreenId,
        dataConfigs,
        screenId,
        useFilter,
        enable
    }
}

function transformComponent(componentConfig: ComponentConfig): TransformComponentType {
    const { id, name, config, autoUpdate, useFilter, type, base, staticData, uniqueTag, parent, dataConfig, dataType, events, filters, from, isDataConfig, screenId, triggers } = componentConfig;
    const dataConfigs = getDataConfigs({ dataConfig, staticData })
    return {
        id, name,
        config: JSON.parse(config),
        autoUpdate: JSON.parse(autoUpdate),
        base: JSON.parse(base),
        uniqueTag,
        triggers: triggers && JSON.parse(triggers),
        useFilter,
        type,
        dataType,
        dataConfigs,
        parent,
        events: JSON.parse(events),
        filters: JSON.parse(filters),
        screenId,
        from,
        isDataConfig
    }
}


function getDataConfigs({
    dataConfig, staticData
}: {
    dataConfig: string | null, staticData: string
}) {
    let newConfig = null;

    if (dataConfig) {
        newConfig = JSON.parse(dataConfig);
    } else {
        newConfig = {};
    }
    newConfig['static'] = JSON.parse(staticData)
    return newConfig;
}



/**
 * @description 计算scale top left view
 * */
export function calculateScaleAndPosition(actualWidth: number, actualHeight: number, targetWidth: number, targetHeight: number) {
    const scaleX = actualWidth / targetWidth;
    const scaleY = actualHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = targetWidth * scale;
    const scaledHeight = targetHeight * scale;

    const left = (actualWidth - scaledWidth) / 2;
    const top = (actualHeight - scaledHeight) / 2;

    return { scale, left, top };
}
