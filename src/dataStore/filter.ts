import { ScreenPreviewType } from '@/type/screen.type';
import { atom } from 'recoil';

export const filters = atom<ScreenPreviewType['filters']>({
    key: 'filters',
    default: [],
});
