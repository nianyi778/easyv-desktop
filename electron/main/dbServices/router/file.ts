import { app, ipcMain } from "electron";
import fs from 'fs';
import path from 'path';

export const getImages = () => {
    ipcMain.handle('get-image', async (_, dirPath) => {
        const appData = app.getPath('userData');
        const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const file = fs.readFileSync(path.join(appData, '/screenResource/', dirPath));
        console.log(file);
        // const images = files.filter((file) =>
        //     imageExtensions.includes(extname(file).toLowerCase().slice(1)))
        //     .map((file) => {
        //         return { src: `${dirPath}/${file}` }
        //     });
        return file;
    })
};