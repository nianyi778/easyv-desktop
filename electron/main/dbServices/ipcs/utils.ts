import { ipcMain } from "electron";
import { join } from 'path';
import customAxios from '../../utils/request';
import { AxiosRequestConfig } from 'axios';

export const initUtilsIpc = () => {
    ipcMain.handle("utils-path", async (event, args) => {
        console.log(args);
        let newArgs = Array.isArray(args) ? args : [args];
        newArgs = newArgs.filter(arg => arg);
        const result = join(...newArgs);
        event.sender.send('utils-path-send', result)
    });


    ipcMain.handle("utils-request", async (event, {
        baseURL,
        headers,
        method = 'GET',
        params,
        path,
        body
    }) => {
        const url = join(baseURL, path);
        const config: AxiosRequestConfig = {
            url: url,
            headers,
            method,
            params,
            data: body
        }
        customAxios(config)
            .then(res => {
                if (res.status === 200) {
                    const { data } = res;
                    event.sender.send('utils-request-send', {
                        success: true,
                        data: Array.isArray(data) ? data : [data]
                    });
                } else {
                    event.sender.send('utils-request-send', {
                        success: false,
                        data: []
                    })
                }
            })
            .catch(error => {
                console.error(error);
                event.sender.send('utils-request-send', {
                    success: false,
                    data: []
                })
            });
    });

};
