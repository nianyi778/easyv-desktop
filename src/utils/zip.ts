import admZip from 'adm-zip'
import iconv from 'iconv-lite'

/**
 * unzip
 *   zipFile，待解压缩的zip文件
 *   destFolder，解压缩后存放的文件夹
 */
export function unzip(zipFile: string | Buffer, destFolder: string) {
    const zip = new admZip(zipFile);
    const zipEntries = zip.getEntries();
    for (let i = 0; i < zipEntries.length; i++) {
        const entry = zipEntries[i];
        entry.entryName = iconv.decode(entry.rawEntryName, 'gbk');
    }
    zip.extractAllTo(destFolder, true);
    // zip.extractAllTo(destFolder, true);
}

/**
 * zip file
 *   sourceFile，待压缩的文件
 *   destZip，压缩后的zip文件
 */
export function zipFile(sourceFile: string, destZip: string) {
    const zip = new admZip();

    zip.addLocalFile(sourceFile);
    zip.writeZip(destZip);
}

/**
* zip folder
*   sourceFolder，待压缩的文件夹
*   destZip，压缩后的zip文件
*/
export function zipFolder(sourceFolder: string, destZip: string) {
    const zip = new admZip();

    zip.addLocalFolder(sourceFolder);
    zip.writeZip(destZip);
}