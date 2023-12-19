import { TransformComponentType } from '@/type/screen';
import { atom } from 'recoil';

export const components = atom<Record<string, TransformComponentType>>({
    key: 'componentsById',
    default: {},
});
