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
        "unmount": boolean;
        "show": "$not" | boolean;
    };
    data?: unknown;
    activeState: {
        animation: {
            config: Events['animation'];
            key: ActionType
        }
    };
    isDefaultAction?: boolean;
    animation: Events['animation'];
    controllers: (string | number)[];
    dynamicData?: unknown;
}
