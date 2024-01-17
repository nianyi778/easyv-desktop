import { Layer } from '@/type/screen.type';
import Home from './index';
import { memo } from 'react';

interface Props { width: number, height: number; layers: Layer[]; }

function Group({ width, height, layers, }: Props) {


    return <div style={{
        width,
        height,
    }}>
        <Home layers={layers}></Home>
    </div>
}


export default memo(Group);