import { Interaction } from '@/type/Interactions.type';
import { atom } from 'recoil';

export const interactions = atom<Interaction[]>({
    key: 'interactions',
    default: [],
});
