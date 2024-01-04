import { Layer } from '@/type/screen.type';
import Home from './index';
import { memo } from 'react';

function Group({ width, height, layers }: { width: number, height: number; layers: Layer[] }) {

    return <div style={{
        width,
        height,
    }}>
        <Home layers={layers}></Home>
    </div>
}

export default memo(Group);