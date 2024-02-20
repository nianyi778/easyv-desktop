import { ComponentRels, Layer } from '@/type/screen.type';
import Home from './index';
import { memo } from 'react';

interface Props {
    width: number, height: number; layers: Layer[];
    componentRels?: ComponentRels[];
    containerItemData?: unknown;
    containerIndex?: number;
}

function Group({ width, height, layers, containerIndex, containerItemData, componentRels }: Props) {


    return <div style={{
        width,
        height,
    }}>
        <Home layers={layers}
            containerIndex={containerIndex}
            componentRels={componentRels}
            containerItemData={containerItemData}
        ></Home>
    </div>
}


export default memo(Group);