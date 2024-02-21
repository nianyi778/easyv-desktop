import { getResourceFile } from './index';
import { DataConfigs, DataType, DataTypeNum, OtherDataType } from '../type/screen.type';
import { TransformSource } from '@/type/source.type';

export async function getSource(dataConfig: any) {
    const { ipcRenderer } = window;
    return new Promise(async (resolve, reject) => {
        const { config, data } = dataConfig;
        if (config && config?.dataId) {
            if (
                config.type === DataTypeNum.CSV
            ) {
                const { filepath: filePath, encode } = config.config;
                const path = getResourceFile(filePath, false)
                await ipcRenderer.invoke('source-csv', {
                    path,
                    encode
                });
                ipcRenderer.on('source-csv-send', (_: any, args: unknown) => {
                    resolve(args);
                });
            }


            if (config.type === DataTypeNum.API) {
                const { headers, params, body, baseURL, path } = config.config;
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


            if (config.type === DataTypeNum.MYSQL) {
                const password = 'b9cb73d145d9e088';
                const { config } = data;
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


export function getDataConfig({ dataConfigs, dataType, sourcesById, containerItemData = [] }: {
    dataConfigs: DataConfigs;
    dataType: DataType;
    containerItemData?: unknown;
    sourcesById: Record<string, TransformSource>
}) {
    const data = dataConfigs[dataType];
    if (dataType === DataType.STATIC) {
        return data as DataConfigs['static']
    }
    if (dataType === DataType.FROM_CONTAINER) {
        // 来自上级
        return {
            ...data,
            data: containerItemData
        };
    }
    if (data) {
        const { config: newData } = data as { config: OtherDataType };
        const dataId = newData?.dataId;
        if (dataId) {
            const current = sourcesById[dataId];
            if (current) {
                return {
                    ...data,
                    config: {
                        ...current,
                        ...newData,
                    }
                }
            }
        }
    }

    return {
        ...data,
        data: [],
    };
}