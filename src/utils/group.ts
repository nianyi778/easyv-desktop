import { calculateSize } from "@lidakai/utils";

export interface SizeType {
    left: number;
    top: number;
    width: number;
    height: number;
}

export function reduceCompute(data: SizeType[]): SizeType {

    const defaultSize = {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
    }

    if (Array.isArray(data) && data.length) {
        const minTop = calculateSize(data, 'top', 'min');
        const minLeft = calculateSize(data, 'left', 'min');
        const maxWidth = calculateSize(data, 'width', 'max');
        const { height: maxHeight, top: maxTop } = calculateSize(data, 'top.height.top', 'max');

        return {
            width: maxWidth,
            height: maxHeight + (maxTop - minTop),
            left: minLeft,
            top: minTop
        }
    }

    return defaultSize;
}
