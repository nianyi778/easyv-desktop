import fs from 'fs';
import { checkFilePath } from './file';
import path from 'path';


export function getScreens() {
    const filePath = checkFilePath('/screenConfig/');
    const files = fs.readdirSync(filePath);
    const screens: any[] = [];
    files.forEach(file => {
        const result = fs.readFileSync(path.join(filePath, file), 'utf-8');
        try {
            screens.push(JSON.parse(result))
        } catch (e) {
            console.log(e);
        }
    })

    return screens;
}