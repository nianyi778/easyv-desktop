import { initUserIpc } from './user';
import { getPath } from './appPath';
import { getFile } from './file';

export default function initIpc() {
    initUserIpc();
    getPath();
    getFile();
}