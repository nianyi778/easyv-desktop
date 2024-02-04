import { ipcMain } from "electron";
import fs from 'fs';
import path from "path";
import { checkFilePath } from "../../utils";

export const getFile = () => {
    ipcMain.handle('convertFileToBase64', (_, filePath: string) => {
        try {
            // 读取 文件内容
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // 将 文件内容进行 Base64 编码
            const base64Data = Buffer.from(fileContent).toString('base64');

            return base64Data;
        } catch (error) {
            console.error('Error converting file to Base64:', error);
            return null;
        }
    })


    ipcMain.handle('createJson', (_, data: Record<string, unknown>) => {
        const filePath = checkFilePath('/screenConfig/', true);
        filePath && Object.keys(data).forEach(value => {
            // 将 JavaScript 对象转换为 JSON 字符串
            const jsonData = JSON.stringify(data[value]);
            // 写入文件，覆盖已存在的文件
            fs.writeFileSync(path.join(filePath, `${value}.json`), jsonData);
            console.log(value, 'JSON 文件写入成功！');
        })
    })

    ipcMain.handle('checkFilePath', (event, {
        src = '', isReadOnly = true
    }) => {
        const filePath = checkFilePath(src, isReadOnly);
        event.sender.send('checkFilePath-send', filePath)
    })
};