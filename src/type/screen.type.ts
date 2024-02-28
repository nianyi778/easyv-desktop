import { AnimateType } from '@/constants';
import type { ComponentFilter, Filter } from './filter.type';
import { ActionType } from '@/constants/defaultConfig';
import { TransformSource } from './source.type';

export enum PanelType {
    panel,
    ref
}

export enum DataFrom {
    norm,
    container
}


export interface TransformPanelType {
    config: {
        height: number;
        hideDefault: boolean;
        left: number;
        top: number;
        animateType: AnimateType;
        width: number;
        allowScroll: boolean;
        animationDuration: number;
        autoCarousel: boolean;
        interval: number;
    };
    createdAt: string;
    id: number;
    name: string;
    screenId: number;
    states: number[];
    type: PanelType;
    updatedAt: string;
    uuid: string;
}
export interface PanelConfig {
    config: {
        config: string;
        createdAt: string;
        deleted: boolean;
        id: number;
        name: string;
        screenId: number;
        states: string;
        type: PanelType;
        updatedAt: string;
        uuid: string;
    };
    stateConfig: Omit<ScreenJsonType, 'info'>[]
}


export interface TransformScreenType {
    id: ScreenType['id'];
    name: ScreenType['name'];
    componentContainerId?: number;
    config: unknown[];
    layers: Layer[];
    components: number[];
    uniqueTag: ScreenType['uniqueTag']
}

export interface ScreenType {
    id: number;
    name: string;
    assets: string;
    components: string;
    config: string;
    customInfo: Record<string, string>;
    globalFilter: null | unknown;
    isShowAlert: 0 | 1,
    isShowLoading: 0 | 1;
    layers: string;
    lines: null | unknown;
    mobileId: string;
    panelId: null | unknown;
    panels: string;
    thumb: null | string;
    uniqueTag: string;
}

export interface ScreenJsonType {
    info?: {
        version: number;
        refScreenIds?: string[];
    };
    sourceConfig: SourceConfig[];
    filterConfig: Filter[];
    panelConfig: PanelConfig[];
    screenConfig: ScreenType[];
    containersConfig: ContainerConfig[];
    componentsConfig: ComponentConfig[];
    componentContainerConfig: ComponentContainerConfig[];
}


export interface SourceConfig {
    config: string;
    dataId: string;
    name: string;
    type: DataTypeNum
}

export type StaticDataType = unknown[];
export type OtherDataType = {
    dataId: string;
    name: string;
    type: DataTypeNum;
    sql?: string;
    body?: string;
    params?: string;
    path?: string;
    headers?: string;
}

export interface DataConfig {
    data: StaticDataType;
    fields: Record<string, unknown>[];
    config: OtherDataType;
    callbackKeys?: string[];
}
export interface DataConfigs {
    static?: DataConfig;
    api?: DataConfig;
    mysql?: DataConfig;
    csv?: DataConfig;
    oracle?: DataConfig;
    mssql?: DataConfig;
    apiGateway?: DataConfig;
    postgresql?: DataConfig;
    clickhouse?: DataConfig;
    dtInsight?: DataConfig;
    dtableapi?: DataConfig;
    damengdb?: DataConfig;
    db2?: DataConfig;
    mqtt?: DataConfig;
    websocket?: DataConfig;
    kingbase?: DataConfig;
    fromContainer?: DataConfig;
}


export interface AutoUpdate {
    isAuto: false;
    interval: number;
}

export interface TransformContainerType {
    id: number;
    name: string;
    filters: ComponentFilter[];
    dataConfigs: DataConfigs;
    screenId: number;
    useFilter: boolean;
    events: Events[];
    subScreenId?: number;
    autoUpdate?: AutoUpdate;
    enable: boolean;
}

export interface ContainerConfig {
    autoUpdate: string;
    dataConfig: null | string;
    dataType: DataType;
    enable: boolean;
    events: string;
    filters: string;
    id: number;
    // dataFrom: 0 | 1;
    dataFrom: DataFrom;
    name: string;
    screenId: number;
    staticData: string;
    useFilter: boolean;
    config: string;
    subScreenId: number;
    componentRels: ComponentRels[];
    dataContainerRels: DataContainerRels[]
}

export interface Events {
    unmount: boolean;
    trigger: string;
    stateId: string;
    name: string;
    id: string;
    reverse: boolean;
    actions: Events[];
    scale: {
        x: number;
        y: number;
        lock: boolean;
        origin: string;
    };
    translate: {
        toX: number;
        toY: number;
    };
    conditions: unknown[];
    conditionType: 'all';
    componentScope: 'current';
    componentConfig: Record<string, unknown>;
    component: (string | number)[];
    animation: {
        type: AnimateType;
        timingFunction: 'linear' | "ease";
        duration: number;
        delay: number;
    };
    actionName: string;
    actionId: string;
    action: ActionType;
    actionData: Record<string, unknown>;
}
// action
export interface TransformComponentType {
    from: 0 | 1; // 0 官方组件/1自定义组件
    id: ContainerConfig['id'];
    name: ContainerConfig['name'];
    config: unknown[];
    autoUpdate?: AutoUpdate;
    parent: number | null;
    base: {
        module_name: string;
        version: string;
    },
    actions?: unknown[];
    dataFrom: DataFrom;
    children?: number[];
    uniqueTag: string;
    useFilter: boolean;
    dataType: ContainerConfig['dataType'];
    dataConfigs: DataConfigs;
    events: Events[];
    filters: ComponentFilter[];
    screenId: ContainerConfig['screenId'];
    type: null | unknown;
    triggers: unknown[];
    isDataConfig: 1 | 0;
    subScreenId?: number;
}

export interface ComponentConfig {
    actions: string;
    autoUpdate: ContainerConfig['autoUpdate'];
    base: string;
    config: string;
    dataFrom: DataFrom;
    dataConfig: ContainerConfig['dataConfig'];
    dataType: ContainerConfig['dataType'];
    events: ContainerConfig['events'];
    filters: ContainerConfig['filters'];
    from: 0 | 1; // 0 官方组件/1自定义组件
    id: ContainerConfig['id'];
    name: ContainerConfig['name'];
    isDataConfig: 1 | 0;
    parent: null | number;
    subScreenId?: number;
    screenId: ContainerConfig['screenId'];
    staticData: ContainerConfig['staticData'];
    triggers: string;
    uniqueTag: string;
    type: null | unknown;
    useFilter: boolean
}

export interface DataContainerRels {
    id: number;
}

export interface ComponentRels {
    tag: string;
    id: number;
    componentId: number;
    componentContainerId: number;
}

export interface TransformComponentContainerType {
    id: number;
    name: string;
    config: unknown[];
    autoUpdate?: AutoUpdate;
    dataFrom: DataFrom;
    dataConfigs: DataConfigs;
    useFilter: boolean;
    subScreenId: number;
    dataType: DataType;
    filters: ComponentFilter[];
    componentRels: ComponentRels[];
    dataContainerRels: DataContainerRels[]
}

export interface ComponentContainerConfig {
    subScreenConfig: Omit<ScreenJsonType, 'info'>;
    filterRels: unknown[];
    componentRels: ComponentRels[];
    componentContainer: ContainerConfig;
    dataContainerRels: DataContainerRels[]

}

export interface Layer {
    id: number | string;
    name: string;
    show: boolean;
    lock: boolean;
    movable?: boolean;
    opacity?: number;
    moduleName: string;
    collapsed?: boolean;
    components?: Layer[];
    hideDefault?: boolean;
}

export enum DataType {
    STATIC = 'static',
    API = 'api',
    MYSQL = 'mysql',
    CSV = 'csv',
    ORACLE = 'oracle',
    MSSQL = 'mssql',
    APIGATEWAY = 'apiGateway',
    POSTGRESQL = 'postgresql',
    CLICKHOUSE = 'clickhouse',
    DTINSIGHT = 'dtInsight',
    DTABLEAPI = 'dtableapi',
    DAMENG = 'damengdb',
    DB2 = 'db2',
    MQTT = 'mqtt',
    WEBSOCKET = 'websocket',
    KINGBASE = 'kingbase',
    FROM_CONTAINER = 'fromContainer',
}

export enum DataTypeNum {
    STATIC = 0,
    CSV = 1,
    API = 2,
    MYSQL = 3,
    ORACLE = 4,
    MSSQL = 5,
    APIGATEWAY = 6,
    POSTGRESQL = 7,
    CLICKHOUSE = 8,
    DTINSIGHT = 9,
    DTABLEAPI = 10,
    DB2 = 11,
    DAMENGDB = 12,
    MQTT = 13,
    WEBSOCKET = 14,
    KINGBASE = 15,
    FROM_CONTAINER = 16,
}



export interface TransformFilterType extends Omit<Filter, 'callbackKeys'> {
    callbackKeys: string[]
}

export interface ScreenPreviewType {
    filters: TransformFilterType[];
    screens: TransformScreenType[];
    source: TransformSource[];
    panel: TransformPanelType[];
    containers: TransformContainerType[];
    components: TransformComponentType[];
    componentContainers: TransformComponentContainerType[];
}


export enum ScreenEnumType {
    "screen" = 'screen',
    panel = "panel",
    ref = "ref",
    container = "container"
}