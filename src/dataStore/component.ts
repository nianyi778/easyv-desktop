import { TransformComponentType } from '@/type/screen.type';
import { atom } from 'recoil';

export const components = atom<Record<string, TransformComponentType>>({
    key: 'componentsById',
    default: {},
});
