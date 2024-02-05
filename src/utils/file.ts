
function join(...paths: string[]) {
    const separator = '/';
    let joinedPath = paths.join(separator);

    // Check if the path starts with a protocol (e.g., file://, http://, https://)
    const hasProtocol = /^(file|http|https):\/\//.test(joinedPath);

    if (hasProtocol) {
        // Extract the protocol and the path
        const protocolIndex = joinedPath.indexOf(':///');
        const protocol = joinedPath.slice(0, protocolIndex + 3);
        const path = joinedPath.slice(protocolIndex + 3);

        // Remove redundant slashes from the path
        const normalizedPath = path.replace(/\/+/g, '/');

        return protocol + normalizedPath;
    }

    // Remove redundant slashes from the path
    const normalizedPath = joinedPath.replace(/\/+/g, '/');

    return normalizedPath;
}


/**
 * @description 创建json 文件
 * */
export function createJson(data: Record<string, unknown>) {
    window.ipcRenderer.invoke('createJson', data);
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
    return join(appData, fileType, filePath);
}


export function fillJoin(filePath: string): string {
    if (!filePath) {
        return ''
    }
    return join('file:', filePath);
}




export function getResourceFile(filePath: string, isFill: boolean = true): string {
    const path = getFilePath({
        filePath,
        fileType: 'screenResource',
    });
    return isFill ? fillJoin(path) : path;
}

/**
 * @description 绝对地址base64
 * */
export function convertFileToBase64(filePath: string) { // 绝对地址
    const appData = window.ipcRenderer.invoke('convertFileToBase64', getResourceFile(filePath, false));
    return appData;
}