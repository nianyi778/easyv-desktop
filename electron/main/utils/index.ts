import admZip from "adm-zip";
import { app } from "electron";
import fs from 'fs';
import path from "path";


// 获取app目录
export const getAppHand = () => {
  return app.getPath("appData");
};

export function checkFilePath(src = '', isReadOnly = true): string {
  if (src) {
    try {
      const appData = app.getPath('userData');
      const filePath = path.join(appData, src)
      // 检查目录是否存在，如果不存在则创建目录
      if (!isReadOnly && !fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        console.log('目录创建成功！');
      }
      return filePath;
    } catch (e) {
      console.warn(`error ${e}`, `src ${src}`, `isReadOnly ${isReadOnly}`)
    }
  }
  return '';
}


export function extractJsonFromZip(zipFilePath: string | Buffer, importScreenKey: string[]): Record<string, unknown> {
  const zip = new admZip(zipFilePath);
  const zipEntries = zip.getEntries();
  const screenResource = app.getPath('userData');

  const isSomeScreen = zipEntries.some((zip: { entryName: string; }) => zip.entryName.endsWith('.screen'));

  if (isSomeScreen) {
    return zipEntries.reduce<Record<string, unknown>>((currentObj: any, entry: { entryName: string; getData: () => string | Buffer; }) => {
      if (entry.entryName.endsWith('.screen')) {
        const result = extractJsonFromZip(entry.getData(), importScreenKey) as Record<string, unknown>;
        return Object.assign(currentObj, result);
      }
      return currentObj;
    }, {})
  }

  const singleZip = zipEntries.reduce<Record<string, unknown>>((currentObj: any, entry: any) => {
    const filePath = entry.entryName;
    if (filePath.endsWith('.json') && importScreenKey.includes(filePath)) {
      // 收集数据 落盘
      const fileContent = zip.readAsText(entry);
      const fileObj = JSON.parse(fileContent);
      const pathSegments = filePath.split('/');
      let fileName = pathSegments[pathSegments.length - 1];
      fileName = fileName.endsWith('.json') ? fileName.substring(0, fileName.length - 5) : fileName;
      currentObj = {
        ...currentObj,
        [fileName]: fileObj
      }
    } else {
      const entryName = path.join(screenResource, '/screenResource/', entry.entryName)
      if (entry.isDirectory) {
        if (!fs.existsSync(entryName)) {
          fs.mkdirSync(entryName, { recursive: true });
        }
      } else {
        /**
         * @描述 写入文件
         * @注释 文件存在则跳过，反之写入
         * */
        !fs.existsSync(entryName) && fs.writeFile(entryName, entry.getData(), (err: any) => {
          if (err) throw err;
          console.log(`${entryName} - 写入成功`);
        });
      }
    }
    return currentObj;
  }, {}) as {
    screenConfig: {
      id: number;
    }
  };;

  return {
    [singleZip.screenConfig.id]: singleZip
  }
}