import fs from 'fs';
import path from 'path';
/**
 * @description 创建json 文件
 * */
export function createJson(data: Record<string, unknown>) {
    const filePath = checkFilePath('/screenConfig/');
    filePath && Object.keys(data).forEach(value => {
        // 将 JavaScript 对象转换为 JSON 字符串
        const jsonData = JSON.stringify(data[value]);
        // 写入文件，覆盖已存在的文件
        fs.writeFileSync(path.join(filePath, `${value}.json`), jsonData);
        console.log(value, 'JSON 文件写入成功！');
    })
}


export function checkFilePath(src = ''): string {
    if (src) {
        const appData = window.appConfig.appDataPath;
        const filePath = path.join(appData, src)
        // 检查目录是否存在，如果不存在则创建目录
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
            console.log('目录创建成功！');
        }

        return filePath;
    }
    return '';
}


export function getFilePath({
    filePath,
    fileType
}: {
    filePath: string;
    fileType: 'screenResource' | "screenConfig"
}): string {
    if (!filePath) {
        return '';
    }
    const appData = window.appConfig.appDataPath;
    return path.join('file://', appData, fileType, filePath);
}



export function getResourceFile(filePath: string) {
    return getFilePath({
        filePath,
        fileType: 'screenResource',
    })
}