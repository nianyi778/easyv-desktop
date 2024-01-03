import type { ComponentFilter, Filter } from './filter.type';

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
        width: number;
        allowScroll: boolean;
        animateType: string;
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

// export interface DataConfigs {
//     [K in DataType]: {
//         data: unknown[];
//     }
// }
export interface DataConfigs {
    static: {
        data: unknown[];
    };
    api: {
        data: unknown[];
    };
    mysql: {
        data: unknown[];
    };
    csv: {
        data: unknown[];
    };
    oracle: {
        data: unknown[];
    };
    mssql: {
        data: unknown[];
    };
    apiGateway: {
        data: unknown[];
    };
    postgresql: {
        data: unknown[];
    };
    clickhouse: {
        data: unknown[];
    };
    dtInsight: {
        data: unknown[];
    };
    dtableapi: {
        data: unknown[];
    };
    damengdb: {
        data: unknown[];
    };
    db2: {
        data: unknown[];
    };
    mqtt: {
        data: unknown[];
    };
    websocket: {
        data: unknown[];
    };
    kingbase: {
        data: unknown[];
    };
    fromContainer: {
        data: unknown[];
    };
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
    events: unknown[];
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
}


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
    events: unknown[];
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

export interface TransformComponentContainerType {
    id: number;
    name: string;
    config: unknown[];
    autoUpdate?: AutoUpdate;
    dataFrom: DataFrom;
    dataConfigs: DataConfigs;
    useFilter: boolean;
    subScreenId: number;
    // filters: ComponentFilter[];
}

export interface ComponentContainerConfig {
    subScreenConfig: Omit<ScreenJsonType, 'info'>;
    filterRels: unknown[];
    dataContainerRels: unknown[];
    componentRels: unknown[];
    componentContainer: ContainerConfig
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
    API = 1,
    MYSQL = 2,
    CSV = 3,
    ORACLE = 4,
    MSSQL = 5,
    APIGATEWAY = 6,
    POSTGRESQL = 7,
    CLICKHOUSE = 8,
    DTINSIGHT = 9,
    DTABLEAPI = 10,
    DAMENG = 11,
    DB2 = 12,
    MQTT = 13,
    WEBSOCKET = 14,
    KINGBASE = 15,
    FROM_CONTAINER = 16,
}


interface TransformFilterType extends Omit<Filter, 'callbackKeys'> {
    callbackKeys: string[]
}

export interface ScreenPreviewType {
    filters: TransformFilterType[];
    screens: TransformScreenType[];
    source: SourceConfig[];
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