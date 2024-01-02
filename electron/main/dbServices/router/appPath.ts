import { ipcMain, app } from "electron";

export const getPath = () => {
    ipcMain.handle('app-getPath', async (_, args) => {
        const res = await app.getPath(args);
        return res;
    })
};