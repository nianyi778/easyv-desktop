import { ipcMain } from "electron";
import { userController } from "../db/controller/user";

export const initUserIpc = () => {
  ipcMain.on("user-addOrUpdate", async (event, arg) => {
    let res = await userController.addOrUpdate(arg);
    console.log(res, 'res');
    event.sender.send
  });
};
