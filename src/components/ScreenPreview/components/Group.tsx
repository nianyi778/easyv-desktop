import { ComponentRels, Layer } from '@/type/screen.type';
import Home from './index';
import { memo } from 'react';

interface Props {
    width: number,
    left: number;
    top: number;
    height: number;
    layers: Layer[];
    componentRels?: ComponentRels[];
    containerItemData?: unknown;
    containerIndex?: number;
}

function Group({ width, height, left, top, layers, containerIndex, containerItemData, componentRels }: Props) {


    return <div style={{
        width,
        height,
        top,
        left
    }}>
        <Home layers={layers}
            containerIndex={containerIndex}
            componentRels={componentRels}
            containerItemData={containerItemData}
        ></Home>
    </div>
}


export default memo(Group);