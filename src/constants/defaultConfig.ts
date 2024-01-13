export const defaultScreenImg = '../../public/default_screen.png';


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
}

