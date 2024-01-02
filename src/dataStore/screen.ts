import { atom } from 'recoil';
import { TransformScreenType } from "@/type/screen.type";

export const screens = atom<Record<string, TransformScreenType>>({
    key: 'screensById',
    default: {},
});