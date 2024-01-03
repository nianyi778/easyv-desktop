import { calculateSize } from "@lidakai/utils";

export interface SizeType {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface ComputeSizeType extends SizeType {
    minLeft: number;
    minTop: number;
}


export function reduceCompute(data: SizeType[]): ComputeSizeType {

    const defaultSize = {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        minLeft: 0,
        minTop: 0
    }

    if (Array.isArray(data) && data.length) {
        const minTop = calculateSize(data, 'top', 'min');
        const minLeft = calculateSize(data, 'left', 'min');
        const { width: maxWidth, left: maxLeft } = calculateSize(data, 'left.width.left', 'max');
        const { height: maxHeight, top: maxTop } = calculateSize(data, 'top.height.top', 'max');

        return {
            width: maxWidth + (maxLeft - minLeft),
            height: maxHeight + (maxTop - minTop),
            left: minLeft,
            top: minTop,
            minLeft: minLeft,
            minTop: minTop
        }
    }

    return defaultSize;
}
