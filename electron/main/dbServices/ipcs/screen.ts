import { ipcMain } from "electron";
import fs from 'fs';
import path from "path";
import { checkFilePath, extractJsonFromZip } from "../../utils";

export const Screen = () => {
    ipcMain.handle('get-screen', (event) => {
        const filePath = checkFilePath('/screenConfig/', false);
        console.log(filePath, 'file')
        const files = fs.readdirSync(filePath);
        const screens: any[] = [];
        files.filter((d: any) => d).forEach((file: any) => {
            try {
                const result = fs.readFileSync(path.join(filePath, file), 'utf-8');
                screens.push(JSON.parse(result))
            } catch (e) {
                console.log(e, file);
            }
        })
        event.sender.send('get-screen-send', screens)
    })

    ipcMain.handle('get-screen-data', (event,
        id: string | number
    ) => {
        const filePath = checkFilePath('/screenConfig/' + id + '.json');
        let data;
        if (filePath && id) {
            try {
                const result = fs.readFileSync(path.join(filePath), 'utf-8');
                data = JSON.parse(result);
            } catch (e) {
                console.log(e);
            }
        }
        event.sender.send('get-screen-data-send', data)
    })



    ipcMain.handle('extract-jsonFrom-zip', (event,
        zipFilePath: string | Buffer,
        importScreenKey: string[]
    ) => {

        const result = extractJsonFromZip(zipFilePath, importScreenKey)

        event.sender.send('extract-jsonFrom-zip-send', result);
    })
};