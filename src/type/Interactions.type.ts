import { Events } from "./screen.type";
import { ActionType, AnimateType } from '@/constants/defaultConfig';

export interface Interaction {
    type: ActionType,
    id?: string | number;
    _from: {
        componentId: string | number
    },
    componentConfig?: Record<string, unknown>;
    component: string | number;
    "state": {
        key?: string;
        "unmount"?: boolean;
        "show"?: "$not" | boolean;
        "stateId"?: number;
        scaleX?: number;
        scaleY?: number;
        transformOrigin?: string;
        toX?: number;
        toY?: number;
        translateToX?: number;
        translateToY?: number;
        rotate?: {
            rotateX: number;
            rotateY: number;
            rotateZ: number;
            perspective: boolean;
        }
    } & Record<string, any>;
    data?: unknown;
    activeState: {
        animation: {
            from?: Record<string, unknown>,
            to?: Record<string, unknown>,
            config: Events['animation'];
            key: AnimateType
        }
    };
    isDefaultAction?: boolean;
    animation: Events['animation'];
    controllers: (string | number)[];
    dynamicData?: unknown;
}
