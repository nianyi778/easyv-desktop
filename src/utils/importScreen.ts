import { importScreenKey } from '@/constants/screenConfig';

export function extractJsonFromZip(zipFilePath: string | Buffer): Promise<Record<string, unknown>> {
    return new Promise((resolve) => {
        const { ipcRenderer } = window;
        ipcRenderer.invoke('extract-jsonFrom-zip', zipFilePath, importScreenKey);
        ipcRenderer.on('extract-jsonFrom-zip-send', (_: any, args: Record<string, unknown>) => {
            resolve(args);
        });
    })

}
