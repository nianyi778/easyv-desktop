import { getResourceFile } from './index';
import { ipcRenderer } from 'electron';
import { DataTypeNum } from '../type/screen.type';

export async function getSource(dataConfig: any) {
    return new Promise(async (resolve, reject) => {
        const { data } = dataConfig;
        if (data && data?.dataId) {
            if (
                data.type === DataTypeNum.CSV
            ) {
                const { filepath: filePath, encode } = data.config;
                const path = getResourceFile(filePath, false)
                await ipcRenderer.invoke('source-csv', {
                    path,
                    encode
                });
                ipcRenderer.on('source-csv-send', (_, args) => {
                    console.log(args);
                    resolve(args);
                });
            }
        } else {
            // filter(xxx);
            // setComData(data);
        }
    })
}