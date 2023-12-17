import fs from 'fs';
import { checkFilePath } from './file';
import path from 'path';
import type { ComponentConfig, ContainerConfig, Layer, PanelConfig, ScreenJsonType, ScreenType, SourceConfig } from '@/type/screen';

/**
 * @description 获取当前本地存在的所有大屏列表
 * @returns 大屏列表json
*/
export function getScreens() {
    const filePath = checkFilePath('/screenConfig/');
    const files = fs.readdirSync(filePath);
    const screens: any[] = [];
    files.forEach(file => {
        const result = fs.readFileSync(path.join(filePath, file), 'utf-8');
        try {
            screens.push(JSON.parse(result))
        } catch (e) {
            console.log(e);
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
 * @description 清洗从本地json 读出的数据，处理成标准数据结构
 * @returns 标准大屏数据
 * @param data  本地json 读出的数据
*/
export function cleanLargeScreenData(data: ScreenJsonType) {
    console.log(data);
    const {
        screenConfig,
        containersConfig = [],
        panelConfig,
        sourceConfig,
        filterConfig,
        componentContainerConfig,
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

    let screens = Array.isArray(screenConfig) ? screenConfig : [screenConfig];
    // screens = screens.concat(componentContainerConfig.reduce((all, cur) => {

    //     return all;
    // }, []))


    const screenSerialize = screens.map(s => transformScreen(s));

    return { filters, screens };
}

function transformComponentContainer(comContainer: ContainerConfig) {
    const { id, name, config, autoUpdate, dataFrom, staticData, dataConfig, } = comContainer;
    const dataConfigs = getDataConfigs({ dataConfig, staticData })

    return {
        id, name,
        config: JSON.parse(config),
        autoUpdate: JSON.parse(autoUpdate),
        dataFrom,
        dataConfigs,
    }
}

function transformSource(sourceConfig: SourceConfig) {
    const { name, type, config, dataId } = sourceConfig;
    return {
        name, type, dataId,
        config: JSON.parse(config),
    }
}

function transformPanel(panelConfig: PanelConfig) {
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

function transformScreen(screenConfig: ScreenType): {
    id: ScreenType['id'];
    name: ScreenType['name'];
    config: unknown[];
    layers: Layer[];
    components: number[];
    uniqueTag: ScreenType['uniqueTag']
} {
    const { id, name, config, layers, components, uniqueTag } = screenConfig;

    return {
        id, name,
        config: JSON.parse(config),
        layers: JSON.parse(layers),
        components: JSON.parse(components),
        uniqueTag
    }
}

function transformContainer(containerConfig: ContainerConfig) {
    const { id, name, config, autoUpdate, staticData, events, filters, screenId, triggers, useFilter, enable, dataConfig } = containerConfig;
    const dataConfigs = getDataConfigs({ dataConfig, staticData })
    return {
        id, name,
        config: JSON.parse(config),
        autoUpdate: JSON.parse(autoUpdate),
        events: JSON.parse(events),
        filters: JSON.parse(filters),
        triggers: JSON.parse(triggers),
        dataConfigs,
        screenId,
        useFilter,
        enable
    }
}

function transformComponent(componentConfig: ComponentConfig) {
    const { id, name, config, autoUpdate, useFilter, type, base, staticData, uniqueTag, dataConfig, dataType, events, filters, from, isDataConfig, screenId, triggers } = componentConfig;
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