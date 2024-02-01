import { ipcMain } from "electron";
import { join } from 'path';

export const initUtilsIpc = () => {
    ipcMain.handle("utils-path", async (event, args) => {
        console.log(args);
        let newArgs = Array.isArray(args) ? args : [args];
        newArgs = newArgs.filter(arg => arg);
        const result = join(...newArgs);
        event.sender.send('utils-path-send', result)
    });


};
