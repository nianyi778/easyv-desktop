import { initUserIpc } from './user';
import { getPath } from './appPath';
import { getFile } from './file';
import { sourceIpc } from './source';

export default function initIpc() {
    initUserIpc();
    getPath();
    getFile();
    sourceIpc();
}