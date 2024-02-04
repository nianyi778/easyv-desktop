
import { getResourceFile } from '@/utils';
// import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react';

/**
 * @description 绝对地址base64
 * */
export function useFileToBase64(): [string | null, (file: string) => void] {
    const { ipcRenderer } = window;
    const [base64, setBase64] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);

    useEffect(() => {
        if (filePath) {
            (async () => {
                const base64Data = await ipcRenderer.invoke('convertFileToBase64', getResourceFile(filePath, false));
                console.log(base64Data, '----===')
                base64Data && setBase64(base64Data);
            })()
        }
    }, [filePath]);

    return [base64, setFilePath];
}

