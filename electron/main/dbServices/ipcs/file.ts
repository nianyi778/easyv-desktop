import { ipcMain } from "electron";
import fs from 'fs';

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
};