
import { getResourceFile } from '@/utils';
import { ipcRenderer } from 'electron'
import { useCallback } from 'react';

/**
 * @description 绝对地址base64
 * */
export function useFileToBase64() {
    const convertFileToBase64 = useCallback((filePath: string) => {
        const base64 = ipcRenderer.invoke('convertFileToBase64', getResourceFile(filePath, false));
        console.log(base64)
        return base64;
    }, [])

    return convertFileToBase64;
}

