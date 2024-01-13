import { Events } from "./screen.type";
import { ActionType } from '@/constants/defaultConfig';

export interface Interaction {
    type: ActionType,
    id?: string | number;
    _from: {
        componentId: string | number
    },
    component: string | number;
    "state": {
        "unmount"?: boolean;
        "show"?: "$not" | boolean;
        "stateId"?: number;
        scaleX?: number;
        scaleY?: number;
        transformOrigin?: string;
    };
    data?: unknown;
    activeState: {
        animation: {
            from?: Record<string, unknown>,
            to?: Record<string, unknown>,
            config: Events['animation'];
            key: ActionType
        }
    };
    isDefaultAction?: boolean;
    animation: Events['animation'];
    controllers: (string | number)[];
    dynamicData?: unknown;
}
