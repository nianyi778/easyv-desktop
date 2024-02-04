import { getResourceFile } from './index';
// import { ipcRenderer } from 'electron';
import { DataTypeNum } from '../type/screen.type';

export async function getSource(dataConfig: any) {
    const { ipcRenderer } = window;
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
                ipcRenderer.on('source-csv-send', (_: any, args: unknown) => {
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
                ipcRenderer.on('utils-request-send', (_: any, result: { data: unknown; }) => {
                    resolve(result.data);
                });
            }


            if (data.type === DataTypeNum.MYSQL) {
                const password = 'b9cb73d145d9e088';
                const { config } = dataConfig.data;
                ipcRenderer.invoke('source-mysql', { ...config, password: password });
                ipcRenderer.on('source-mysql-send', (_: any, result: { data: unknown; }) => {
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