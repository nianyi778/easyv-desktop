import { ReactNode, memo } from "react";
import HideShowToggle from "./HideShowToggle"
import { AnimateType } from "@/constants";
import MoveToggle from "./MoveToggle";
import Flip from "./Flip";
import Scale from "./Scale";


export enum AnimationState {
    'default',
    "start",
    "end"
}

export interface Config {
    visible: boolean;
    unmount?: boolean;
    childrenWidth?: number;
    animationDuration?: number;
    delay?: number;
    scaleX?: number;
    scaleY?: number;
    transformOrigin?: string;
}

const defaultConfig = {
    visible: false,
    unmount: true,
    childrenWidth: 200, // px
    animationDuration: 1 // s
}

interface Props { // AnimateType
    type: AnimateType; children: ReactNode; config: Config
}

function Animation({ type, children, config }: Props) {

    const newConfig = { ...defaultConfig, ...config } as Required<Config>
    switch (type) {
        case AnimateType.moveLeft:
        case AnimateType.moveTop:
        case AnimateType.moveRight:
        case AnimateType.moveBottom:
            return <MoveToggle type={type} config={newConfig}>{children}</MoveToggle>
            break;
        case AnimateType.flipLateral:
        case AnimateType.flipVertical:
            return <Flip config={newConfig}>{children}</Flip>
            break;
        case AnimateType.Show:
        case AnimateType.Hide:
        case AnimateType.ShowHide:
        case AnimateType.opacity:
        case AnimateType.SetIndex:
            return <HideShowToggle config={newConfig}>{children}</HideShowToggle>
            break;
        case AnimateType.Scale:
            return <Scale config={newConfig}>{children}</Scale>
            break;
        case AnimateType.none:
        default:
            return children;
            break;
    }
}



export default memo(Animation)

export const defaultAnimation = { // 默认配置
    show: true,
    unmount: true,
    delay: 0,
    duration: 0,
    timingFunction: "linear",
    type: "opacity"
};