import { AutoLayoutConfigProps, ScrollSettingsConfigProps } from "@/type/com-container.type";
import chunk from "lodash/chunk";
import { CSSProperties, memo, useMemo } from "react";
import ScreenPreview from '../index';
import { ScreenEnumType } from "@/type/screen.type";

/**
 * @description 组件容器动画
 * */
function ContainerAnimation({
    bgStyle,
    containerId,
    subScreenId,
    autoLayoutConfig,
    scrollSettingsConfig,
    containerData = [],
    boxEffectiveSize
}: {
    containerData?: unknown[]
    subScreenId: number;
    boxEffectiveSize: {
        width: number;
        height: number;
        left: number;
        top: number;
    },
    bgStyle?: CSSProperties;
    containerId: string;
    autoLayoutConfig: AutoLayoutConfigProps;
    scrollSettingsConfig: ScrollSettingsConfigProps;
}) {
    const { width: lineWidth, height: lineHeight, left, top } = boxEffectiveSize;
    const { spacing, layoutType, lineNumber, columnNumber } = autoLayoutConfig;
    const vertical = layoutType === 'column';
    const num = !vertical ? lineNumber : columnNumber; // 行数或者列数
    const chunkData = chunk(containerData, num);
    const { enableScrolling, interval, animationTypes, beyondScroll, backgroundFixed } = scrollSettingsConfig;
    const offsetWidth = lineWidth + left;
    const offsetHeight = lineHeight + top;

    const styles = useMemo(() => {
        if (vertical) {
            return {
                // 列优先
                width: lineWidth * num + (num - 1) * spacing.columnSize,
                height: lineHeight * chunkData.length + (chunkData.length - 1) * spacing.lineSize,
                gridGap: `${spacing.lineSize}px ${spacing.columnSize}px`,
                gridTemplateColumns: `repeat(${num}, ${lineWidth}px)`,
                gridAutoFlow: 'row', // 先把第一行的列填满
                gridTemplateRows: `repeat(auto-fill, ${lineHeight}px)`,
            }
        }
        return {
            // 行优先
            width: lineWidth * chunkData.length + (chunkData.length - 1) * spacing.columnSize,
            height: lineHeight * num + (num - 1) * spacing.lineSize,
            gridGap: `${spacing.lineSize}px ${spacing.columnSize}px`,
            gridTemplateRows: `repeat(${num}, ${lineHeight}px)`,
            gridAutoFlow: 'column', // 先把第一列的行填满
            gridTemplateColumns: `repeat(auto-fill, ${lineWidth}px)`,
        };
    }, [chunkData.length, lineHeight, lineWidth, num, spacing.columnSize, spacing.lineSize, vertical])

    const overflow: CSSProperties = useMemo(() => {
        if (beyondScroll === 'auto' || !enableScrolling) {
            return { overflow: 'hidden' };
        }
        // 列
        return vertical ? {
            overflowY: 'scroll',
        } : {
            overflowX: 'scroll',
        }
    }, [beyondScroll, enableScrolling, vertical])


    return <div style={{ ...overflow, ...(backgroundFixed ? bgStyle : {}) }} className=" w-full h-full">
        <div style={styles} className=" grid">
            {
                containerData.map((c, index) => <span key={index} style={{
                    width: lineWidth,
                    height: lineHeight,
                    overflow: 'hidden',
                    ...(backgroundFixed ? {} : bgStyle)
                }}>
                    <div style={{
                        position: 'relative',
                        width: offsetWidth,
                        height: offsetHeight,
                        transform: `translate3d(${-1 * left}px, ${-1 * top}px, 0px)`,
                    }}>
                        <ScreenPreview screenId={subScreenId} type={ScreenEnumType.container} width={lineWidth} height={lineHeight} />
                    </div>
                </span>)
            }
        </div>
    </div>

}

export default memo(ContainerAnimation);