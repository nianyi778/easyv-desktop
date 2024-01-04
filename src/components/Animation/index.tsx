import { ReactNode } from "react";
import HideShowToggle from "./HideShowToggle"
import { AnimateType } from "@/constants";
import MoveToggle from "./MoveToggle";


export enum AnimationState {
    'default',
    "start",
    "end"
}

export interface Config {
    visible: boolean;
    unmount?: boolean;
    childrenWidth?: number;
}

const defaultConfig = {
    visible: false,
    unmount: true,
    childrenWidth: 200
}

export default function Animation({ type = AnimateType.opacity, children, config }: { type: AnimateType; children: ReactNode; config: Config }) {

    const newConfig = { ...defaultConfig, ...config }

    switch (type) {
        case AnimateType.moveLeft:
        case AnimateType.moveTop:
        case AnimateType.moveRight:
        case AnimateType.moveBottom:
            return <MoveToggle type={type} config={newConfig}>{children}</MoveToggle>
            break;
        case AnimateType.opacity:
        default:
            return <HideShowToggle config={newConfig}>{children}</HideShowToggle>
            break;
    }
}