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
    type: AnimateType; children: ReactNode; config: Config, visible: boolean;
}

function Animation({ type, children, config, visible }: Props) {

    const newConfig = { ...defaultConfig, ...config } as Required<Config>
    switch (type) {
        case AnimateType.moveLeft:
        case AnimateType.moveTop:
        case AnimateType.moveRight:
        case AnimateType.moveBottom:
            return <MoveToggle type={type} visible={visible} config={newConfig}>{children}</MoveToggle>
            break;
        case AnimateType.flipLateral:
        case AnimateType.flipVertical:
            return <Flip config={newConfig} visible={visible}>{children}</Flip>
            break;
        case AnimateType.scale:
            return <Scale config={newConfig} visible={visible}>{children}</Scale>
            break;
        case AnimateType.none:
            return children;
            break;
        case AnimateType.opacity:
        default:
            return <HideShowToggle config={newConfig} visible={visible}>{children}</HideShowToggle>
            break;
    }
}



export default Animation

export const defaultAnimation = { // 默认配置
    show: true,
    unmount: true,
    delay: 0,
    duration: 0,
    timingFunction: "linear",
    type: "opacity"
};