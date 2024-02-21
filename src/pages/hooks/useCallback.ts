import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { callbackState } from '@/dataStore/callback';
import { CallbackState } from '@/type/callback.type';

export function useCallbackUpdate() {
    const setCallback = useSetRecoilState(callbackState);

    const updateCallbackValue = useCallback((data: Record<string, unknown>, id: number) => {
        setCallback(x => {
            const oldKeys = x.callbackKeys.interaction[id] || [];
            const keys = Object.keys(data).filter((d) => d);
            const newKeys = Array.from(new Set(oldKeys.concat(keys)));
            const callbackKeys = {
                ...x.callbackKeys,
                interaction: {
                    ...x.callbackKeys.interaction,
                    [id]: newKeys,
                },
            };
            const newCall = {
                callbackKeys,
                callbackValues: {
                    ...x.callbackValues,
                    ...data
                }
            }
            return newCall;
        })
    }, [setCallback]);

    const initCallbackKeys = useCallback((data: CallbackState['callbackKeys']) => {
        setCallback(x => {
            return {
                callbackKeys: data,
                callbackValues: x.callbackValues
            }
        })
    }, [setCallback]);


    return {
        updateCallbackValue,
        initCallbackKeys
    };
}