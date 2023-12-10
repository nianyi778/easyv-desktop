import { importScreenKey } from '@/constants/screenConfig';
import admZip from 'adm-zip'
import path from 'path';
import fs from 'fs';

export function extractJsonFromZip(zipFilePath: string | Buffer): Record<string, unknown> {
    const zip = new admZip(zipFilePath);
    const zipEntries = zip.getEntries();
    const screenResource = window.appConfig.appDataPath;

    const isSomeScreen = zipEntries.some(zip => zip.entryName.endsWith('.screen'));

    if (isSomeScreen) {
        return zipEntries.reduce<Record<string, unknown>>((currentObj, entry) => {
            if (entry.entryName.endsWith('.screen')) {
                const result = extractJsonFromZip(entry.getData()) as Record<string, unknown>;
                return Object.assign(currentObj, result);
            }
            return currentObj;
        }, {})
    }

    const singleZip = zipEntries.reduce<Record<string, unknown>>((currentObj, entry) => {
        const filePath = entry.entryName;
        if (filePath.endsWith('.json') && importScreenKey.includes(filePath)) {
            // 收集数据 落盘
            const fileContent = zip.readAsText(entry);
            const fileObj = JSON.parse(fileContent);
            const pathSegments = filePath.split('/');
            let fileName = pathSegments[pathSegments.length - 1];
            fileName = fileName.endsWith('.json') ? fileName.substring(0, fileName.length - 5) : fileName;
            currentObj = {
                ...currentObj,
                [fileName]: fileObj
            }
        } else {
            const entryName = path.join(screenResource, '/screenResource/', entry.entryName)
            if (entry.isDirectory) {
                if (!fs.existsSync(entryName)) {
                    fs.mkdirSync(entryName, { recursive: true });
                }
            } else {
                /**
                 * @描述 写入文件
                 * @注释 文件存在则跳过，反之写入
                 * */
                !fs.existsSync(entryName) && fs.writeFile(entryName, entry.getData(), err => {
                    if (err) throw err;
                    console.log(`${entryName} - 写入成功`);
                });
            }
        }
        return currentObj;
    }, {}) as {
        screenConfig: {
            id: number;
        }
    };;

    return {
        [singleZip.screenConfig.id]: singleZip
    }
}
