import { TransformComponentContainerType } from '@/type/screen.type';
import { atom } from 'recoil';

export const comContainers = atom<Record<string, TransformComponentContainerType>>({
    key: 'comContainersById',
    default: {},
});
