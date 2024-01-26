import { getResourceFile } from './index';
import { ipcRenderer } from 'electron';
import { DataTypeNum } from '../type/screen.type';
import path from 'path';

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
                    resolve(args);
                });
            }


            if (data.type === DataTypeNum.API) {
                const { headers, params, body, baseURL, path } = data.config;
                const paramsParse = parseQueryString(params);
                let newHeaders = {}, newBody = {};
                try {
                    newHeaders = JSON.parse(headers || '{}');
                    newBody = JSON.parse(body || '{}')
                } catch (err) {
                    console.info(err);
                }
                ipcRenderer.invoke('utils-request', {
                    headers: newHeaders, params: paramsParse, body: newBody, baseURL, path
                });
                ipcRenderer.on('utils-request-send', (_, result) => {
                    resolve(result.data);
                });
            }
        } else {
            // filter(xxx);
            // setComData(data);
            resolve(data);
        }
    })
}

function parseQueryString(queryString: string) {
    const params: Record<string, unknown> = {};
    const keyValuePairs = queryString.split('&');

    for (let pair of keyValuePairs) {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
    }

    return params;
}