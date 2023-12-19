import { atom } from 'recoil';
import { TransformScreenType } from "@/type/screen";

export const screens = atom<Record<string, TransformScreenType>>({
    key: 'screensById',
    default: {},
});