import { AutoLayoutConfigProps, ScrollSettingsConfigProps } from "@/type/com-container.type";
import { chunk } from "lodash-es";
import { CSSProperties, memo, useMemo, useEffect, useRef, useState } from "react";
import ScreenPreview from '../index';
import { ScreenEnumType } from "@/type/screen.type";
import * as d3 from 'd3';
import isNumber from "lodash-es/isNumber";
import { setIntervalRAF } from "@/utils";

/**
 * @description 组件容器动画
 * */
function ContainerAnimation({
    bgStyle,
    width,
    height,
    containerId,
    subScreenId,
    autoLayoutConfig,
    scrollSettingsConfig,
    containerData = [],
    boxEffectiveSize
}: {
    width: number;
    height: number;
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
    const [animationState, setAnimationState] = useState<'pause' | 'play' | 'stop'>('play');

    const { width: lineWidth, height: lineHeight, left, top } = boxEffectiveSize;
    const { spacing, layoutType, lineNumber, columnNumber } = autoLayoutConfig;
    const vertical = layoutType === 'column';
    const num = !vertical ? lineNumber : columnNumber; // 行数或者列数
    const chunkData = chunk(containerData, num);
    const { enableScrolling, interval, animationTypes, beyondScroll, backgroundFixed } = scrollSettingsConfig;
    const offsetWidth = lineWidth + left;
    const offsetHeight = lineHeight + top;

    const containerRef = useRef<HTMLDivElement>(null);
    const countRef = useRef(0)

    const translateAnimation = useMemo(() => {
        if (animationTypes === 'single') {
            return chunkData.reduce<number[]>((all, _, index) => {
                const v = (vertical ? lineHeight + spacing.lineSize : lineWidth + spacing.columnSize);
                return all.concat(index * v);
            }, [])
        } if (animationTypes === 'all') {
            const v = vertical ? height : width;
            const dataLen = chunkData.length;
            const itemMax = (vertical ? lineHeight * dataLen + spacing.lineSize * (dataLen - 1) : lineWidth * dataLen + spacing.columnSize * (dataLen - 1))
            const splitArray = Array(Math.ceil(itemMax / v)).fill(1);
            return splitArray.reduce<number[]>((all, _, index) => all.concat(index * v), [])
        }
        return [];

    }, [animationTypes, chunkData, height, lineHeight, lineWidth, spacing.columnSize, spacing.lineSize, vertical, width]);



    useEffect(() => {
        if (!enableScrolling && containerRef.current) {
            // reset
            d3.select<d3.BaseType, HTMLDivElement>(containerRef.current).style('transform', `translate3d(0px, 0px, 0px)`);
        }
    }, [enableScrolling]);

    const isInterval = useMemo(() => {
        if (translateAnimation.length && enableScrolling && beyondScroll === 'auto' && animationState === 'play') {
            // 节点存在
            return true;
        }

        return false;
    }, [animationState, beyondScroll, enableScrolling, translateAnimation])

    useEffect(() => {
        const containerLayerId = `container_${containerId}`;

        function handlePauseEvent() {
            setAnimationState('pause')
        }
        function handlePlayEvent() {
            setAnimationState('play')
        }
        function handleStopEvent() {
            setAnimationState('stop')
            countRef.current = 0;
        }
        document.addEventListener(`containerPlay_${containerLayerId}`, handlePlayEvent);
        document.addEventListener(`containerPause_${containerLayerId}`, handlePauseEvent);
        document.addEventListener(`containerStop_${containerLayerId}`, handleStopEvent);
        return () => {
            document.removeEventListener(`containerPlay_${containerLayerId}`, handlePlayEvent);
            document.removeEventListener(`containerPause_${containerLayerId}`, handlePauseEvent);
            document.removeEventListener(`containerStop_${containerLayerId}`, handleStopEvent);
        }

    }, [containerId])

    useEffect(() => {
        let clearIntervalRAF: () => void;
        if (isInterval && containerRef.current) {
            clearIntervalRAF = setIntervalRAF(() => {
                if (countRef.current > (translateAnimation.length - 1)) {
                    countRef.current = 0;
                }
                const cur = translateAnimation[countRef.current];
                if (isNumber(cur)) {
                    countRef.current += 1;
                    const value = vertical ? `translate3d(0px, ${-cur}px, 0px)` : `translate3d(${-cur}px, 0px, 0px)`;

                    d3.select<d3.BaseType, HTMLDivElement>(containerRef.current).style('transform', value);
                }
            }, interval * 1000);

        }
        return () => {
            clearIntervalRAF?.();
        }
    }, [translateAnimation, vertical, interval, isInterval])


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
        <div style={styles} className=" grid transition-['translate3d']" ref={containerRef} >
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