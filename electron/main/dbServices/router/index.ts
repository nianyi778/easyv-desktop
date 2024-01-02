import { initUserIpc } from './user';
import { getPath } from './appPath';
import { getImages } from './file';

export default function initIpc() {
    initUserIpc();
    getPath();
    getImages();
}