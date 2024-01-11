import { ReactNode, memo } from "react";
import HideShowToggle from "./HideShowToggle"
import { AnimateType } from "@/constants";
import MoveToggle from "./MoveToggle";
import Flip from "./Flip";


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
}

const defaultConfig = {
    visible: false,
    unmount: true,
    childrenWidth: 200, // px
    animationDuration: 1 // s
}

interface Props {
    type: AnimateType; children: ReactNode; config: Config
}

function Animation({ type = AnimateType.opacity, children, config }: Props) {

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
        case AnimateType.opacity:
        default:
            return <HideShowToggle config={newConfig}>{children}</HideShowToggle>
            break;
    }
}

function areEqual(props: Props, nextProps: Props) {

    return props.config.visible === nextProps.config.visible
}

export default memo(
    Animation, areEqual
)

export const defaultAnimation = { // 默认配置
    show: true,
    unmount: true,
    delay: 0,
    duration: 0,
    timingFunction: "linear",
    type: "opacity"
};