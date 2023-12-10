import { dbConnectionHand } from "./db/dbInit";
import initIpc from "./router";

export const mainInitHand = async () => {
  await dbConnectionHand();
  await initIpc()
};
