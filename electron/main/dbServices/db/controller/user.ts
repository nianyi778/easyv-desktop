import { userServices } from "../services/user";
export class userController {
  static async addOrUpdate({ id, userName, nickName }: { id?: number; userName: string; nickName: string }) {
    let tick = id ? userServices.updateUser : userServices.addUser;
    let res = await tick({ id, userName, nickName });
    return res
  }
}
