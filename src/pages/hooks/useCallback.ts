import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { callbackState } from '@/dataStore/callback';

export function useCallbackUpdate() {
    const setCallback = useSetRecoilState(callbackState);

    const updateCallbackValue = useCallback((data: Record<string, unknown>) => {
        setCallback(x => {
            const newCall = {
                ...x,
                callbackValues: {
                    ...x.callbackValues,
                    ...data
                }
            }
            return newCall;
        })
    }, [setCallback]);

    const updateCallbackKeys = useCallback((data: Record<string, unknown>) => {
        console.log(data);
    }, [setCallback]);


    return {
        updateCallbackValue,
        updateCallbackKeys
    };
}