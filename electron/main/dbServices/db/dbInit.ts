import "reflect-metadata"
import { DataSource } from "typeorm";
import { DB_CONFIG, APP_NAME } from "../../utils/constants";
import { getAppHand } from "../../utils";
import { User } from './entity/user'
import path from "path";
export let dataSource: DataSource;
export const dbConnectionHand = async () => {
  const dataBase = path.join(getAppHand(), APP_NAME, DB_CONFIG.dbFileName);
  dataSource = new DataSource({
    type: 'sqlite',
    // 完整文件路径
    database: dataBase,
    logging: false,
    logger: "simple-console",
    synchronize: true,
    entities: [User],
    // path.join(__dirname, "./entity/*.ts")
  });
  dataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!",)
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })
};
