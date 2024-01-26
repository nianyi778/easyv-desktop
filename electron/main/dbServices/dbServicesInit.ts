import { dbConnectionHand } from "./db/dbInit";
import initIpc from "./ipcs";

export const mainInitHand = async () => {
  await dbConnectionHand();
  await initIpc()
};
