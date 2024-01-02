import { TransformPanelType } from '@/type/screen.type';
import { atom } from 'recoil';

export const panels = atom<Record<string, TransformPanelType>>({
    key: 'panelsById',
    default: {},
});
