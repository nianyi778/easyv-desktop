import { screenPreviewType } from '@/type/screen';
import { atom } from 'recoil';

export const filter = atom<screenPreviewType['filters']>({
    key: 'filters',
    default: [],
});
