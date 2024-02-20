import { CallbackState } from '@/type/callback.type';
import { atom } from 'recoil';

export const callbackState = atom<CallbackState>({
    key: 'callback',
    default: {
        callbackKeys: {
            filter: {},
            data: {},
            interaction: {}
        },
        callbackValues: {}
    },
});
