import { ReactNode } from "react";
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

export default function Animation({ type = AnimateType.opacity, children, config }: { type: AnimateType; children: ReactNode; config: Config }) {

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