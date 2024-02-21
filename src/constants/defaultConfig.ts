import default_screen from '@/assets/default_screen.png';


export const defaultScreenImg = default_screen;

export enum ActionType {
    Show = 'show',
    Hide = 'hide',
    ShowHide = 'show/hide',
    Translate = 'translate',
    Scale = 'scale',
    Rotate = 'rotate',
    UpdateData = 'updateData',
    SwitchState = 'switchState',
    AutoSwitchState = 'autoSwitchState',
    UpdateConfig = 'updateConfig',
    SetIndex = 'setIndex',
    switchView = 'switchView',
}

export const defaultActions = [
    { name: '显示', value: ActionType.Show },
    { name: '隐藏', value: ActionType.Hide },
    { name: '显隐切换', value: ActionType.ShowHide },
    { name: '移动', value: ActionType.Translate },
    { name: '缩放', value: ActionType.Scale },
    { name: '旋转', value: ActionType.Rotate },
    { name: '更新数据', value: ActionType.UpdateData },
    { name: '切换组件状态', value: ActionType.SwitchState },
    { name: '更新组件配置', value: ActionType.UpdateConfig }
];


export enum AnimateType {
    'none' = "none",
    'opacity' = 'opacity',
    'moveLeft' = "moveLeft",
    'moveRight' = "moveRight",
    'moveTop' = "moveTop",
    'moveBottom' = "moveBottom",
    'boxFlipTB' = 'boxFlipTB',
    'boxFlipLF' = 'boxFlipLF',
    'flipVertical' = 'flipVertical',
    'flipLateral' = 'flipLateral',
    "scale" = "scale",
}



export const defaultAnimation = {
    key: AnimateType.opacity,
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
    config: {
        duration: 1000,
        timingFunction: 'linear',
        delay: 0,
    },
};


export const MAX_DELAY = 2147483;


export const sourceOptions = [
    { name: 'CSV文件', value: 'csv' },
    { name: 'DTable API', value: 'dtableapi' },
    { name: 'API接口', value: 'api' },
    { name: 'MySQL数据库', value: 'mysql' },
    { name: 'Oracle数据库', value: 'oracle' },
    { name: 'SQL Server数据库', value: 'mssql' },
    { name: '达梦数据库', value: 'damengdb' },
    { name: 'PostgreSQL数据库', value: 'postgresql' },
    { name: 'DB2数据库', value: 'db2' },
    { name: 'WebSocket', value: 'websocket' },
    { name: 'MQTT', value: 'mqtt' },
    { name: '阿里云API网关', value: 'apiGateway' },
    { name: '数栈 API', value: 'dtInsight' },
    { name: 'ClickHouse数据库', value: 'clickhouse' },
    { name: '金仓数据库', value: 'kingbase' },
];