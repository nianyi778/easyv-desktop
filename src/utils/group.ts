import { calculateSize } from "@easyv/admin-utils";

export interface SizeType extends Record<string, unknown> {
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
        const minTop = calculateSize(data, 'top', 'min') as number;
        const minLeft = calculateSize(data, 'left', 'min') as number;
        const maxWidth = calculateSize(data, 'width', 'max') as number;
        const { height: maxHeight, top: maxTop } = calculateSize(data, 'top.height.top', 'max') as SizeType;

        return {
            width: maxWidth,
            height: maxHeight + (maxTop - minTop),
            left: minLeft,
            top: minTop
        }
    }

    return defaultSize;
}
