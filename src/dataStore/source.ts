import { atom } from 'recoil';
import { TransformSource } from '@/type/source.type';

export const sources = atom<Record<string, TransformSource>>({
    key: 'sourcesById',
    default: {},
});