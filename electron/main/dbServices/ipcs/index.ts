import { initUserIpc } from './user';
import { getPath } from './appPath';
import { getFile } from './file';
import { sourceIpc } from './source';
import { initUtilsIpc } from './utils';
import { Screen } from './screen';

export default function initIpc() {
    initUserIpc();
    getPath();
    getFile();
    sourceIpc();
    initUtilsIpc();
    Screen();
}