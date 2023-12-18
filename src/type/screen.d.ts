import type { Filter } from './filter';

export enum PanelType {
    panel,
    ref
}

export enum DataFrom {
    norm,
    container
}


export interface TransformPanelType {
    config: unknown[];
    createdAt: Date<string>;
    id: number;
    name: string;
    screenId: number;
    states: unknown[];
    type: PanelType;
    updatedAt: Date<string>;
    uuid: string;
}
interface PanelConfig {
    config: {
        config: string;
        createdAt: Date<string>;
        deleted: boolean;
        id: number;
        name: string;
        screenId: number;
        states: string;
        type: PanelType;
        updatedAt: Date<string>;
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

interface ScreenType {
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

export interface DataConfigs {
    [DataType]: {
        data: unknown;
    }
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

interface ContainerConfig {
    autoUpdate: string;
    dataConfig: null | string;
    dataType: DataType;
    enable: boolean;
    events: string;
    filters: string;
    id: number;
    dataFrom: 0 | 1;
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
    base: {
        module_name: string;
        version: string;
    },
    uniqueTag: string;
    useFilter: boolean;
    dataType: ContainerConfig['dataType'];
    dataConfigs: DataConfigs;
    dataConfigs: unknown[];
    events: unknown[];
    filters: ComponentFilter[];
    screenId: ContainerConfig['screenId'];
    uniqueTag: string;
    type: null | unknown;
    triggers: unknown[];
    isDataConfig: 1 | 0;
    subScreenId?: number;
}

interface ComponentConfig {
    actions: string;
    autoUpdate: ContainerConfig['autoUpdate'];
    base: string;
    config: string;
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
    triggers: ContainerConfig['triggers'];
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
    config?: unknown[];
    dataConfigs: DataConfigs;
}

interface ComponentContainerConfig {
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
    moduleName?: string;
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




export interface screenPreviewType {
    filters: Filter[];
    screens: TransformScreenType[];
    source: SourceConfig[];
    panel: TransformPanelType[];
    containers: TransformContainerType[];
    components: TransformComponentType[];
    componentContainers: TransformComponentContainerType[];
}