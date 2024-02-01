import { ipcMain } from "electron";
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import iconv from 'iconv-lite'
import jsCharDet from 'jschardet'
import retry from 'async-retry'
import { promisify } from 'util';
import { Readable } from 'stream';
import { join } from 'path';
import customAxios from '../../utils/dataGet/request';
import customMysql from '../../utils/dataGet/mysql';
import { AxiosRequestConfig } from 'axios';

export const sourceIpc = () => {


    ipcMain.handle("source-csv", async (event, { path,
        encode }) => {
        // 读取本地 CSV 文件
        const file = await readFile(path);

        if (file) {
            let charset = 'gbk';
            try {
                charset = ['utf8', 'gbk'].includes(encode) ? encode : getCharset(jsCharDet.detect(file).encoding);
            } catch (err) {
                console.error(err);
            }
            const str = iconv.decode(file, charset)
            // 解析 CSV 数据
            const records = parse(str, {
                columns: true,
                skip_empty_lines: true
            });
            event.sender.send('source-csv-send', records);
        } else {
            console.log('csv 文件不存在');
        }
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


    ipcMain.handle('source-mysql', async (event, config) => {
        const result = await customMysql(config);
        event.sender.send('source-mysql-send', {
            success: !!result,
            data: Array.isArray(result) ? result : []
        })
    })


};

function getCharset(charset: string): string {
    switch (charset) {
        case 'UTF-8':
            return 'utf8'
        case 'UTF-16BE':
            return 'utf16-be'
        case 'UTF-16LE':
            return 'utf16-le'
        case 'ascii':
            return 'ascii'
        default:
            return 'gbk'
    }
}

async function readFile(path: string) {
    try {
        const buffer = await retry(async () => {
            const fileStream = await getFile(path);
            return new Promise<Buffer>((resolve, reject) => {
                const chunks: Uint8Array[] = []
                fileStream.on('error', reject)
                fileStream.on('data', data => chunks.push(data))
                fileStream.on('end', () => resolve(Buffer.concat(chunks)))
            })
        }, {
            retries: 2,
            minTimeout: 500,
        },);
        return buffer;
    } catch (err) {
        console.info(err, 'read file failed');
        // Handle the error
    }
}


async function getFile(filePath: string) {
    const readFileAsync = promisify(fs.readFile);
    try {
        const fileData = await readFileAsync(filePath);
        const fileStream = new Readable();
        fileStream.push(fileData);
        fileStream.push(null); // 表示数据已经读取完毕
        return fileStream;
    } catch (error: any) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}