import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimateType, defaultAnimation } from "@/constants";
import { isNumber } from "lodash-es";
import { Interaction } from "@/type/Interactions.type";
import * as d3 from "d3";
import { easeMap } from "./easeMap";



type AnimationProps = {
    children: React.ReactNode;
    childrenWidth?: number;
    iState?: Interaction['state'];
    duration?: number;
    id: string | number;
    iActiveState?: Interaction['activeState'],
    size: {
        width: number;
        height: number;
        left: number;
        top: number;
    }
};

function Animation({
    children,
    size,
    iState = {},
    iActiveState,
    id,
    duration = 1000,
    childrenWidth = 0,
}: AnimationProps) {
    const { animation = defaultAnimation } = iActiveState || {};
    const {
        key,
        config = defaultAnimation.config
    } = animation;


    const { timingFunction = 'linear', duration: transFormDuration } = config;
    const ref = useRef<HTMLDivElement>(null)
    const { show = true, unmount = true } = iState;
    const { width, height, left, top } = size;

    const [visibility, setVisibility] = useState(false);


    const display: 'block' | 'none' = visibility ? 'block' : 'none';
    const ease = easeMap[timingFunction] || easeMap.linear;
    const box = [AnimateType.boxFlipTB, AnimateType.boxFlipLF].includes(key);

    const { transform, transformOrigin } = getNextStatus(iState, {
        position: { x: left, y: top },
        animationType: key,
        childrenWidth,
        show: show as boolean,
        visibility
    });


    useEffect(() => {
        show && setVisibility(true);
        if (ref.current) {
            d3.select(ref.current)
                // .transition()
                // .duration(duration)
                // .ease(ease)
                // .style("transform", transform)
                .transition()
                .duration(transFormDuration)
                .ease(ease)
                .style("opacity", show ? 1 : 0)
                .on("end", () => {
                    if (!show) {
                        setVisibility(false)
                    }
                });
        }
    }, [show, transFormDuration, ease]);


    const transition = useMemo(() => {
        if (!visibility && !box) {
            return null;
        }


        return `transform ${duration}ms ${timingFunction}`;
    }, [visibility, duration, timingFunction, box]);

    const styles = {
        width,
        height,
        left,
        top,
        position: 'absolute',
        transformOrigin,
        visibility: !visibility ? 'hidden' : 'visible',
        transform,
        transformStyle: 'preserve-3d',
        transition: transition,
        // ,opacity ${transFormDuration}ms ${timingFunction}
    } as React.CSSProperties;


    return <div ref={ref} style={styles} id={`animation_${id}`}>
        <span style={{
            pointerEvents: 'none',
            display
        }}>
            {unmount && !visibility ? null : children}
        </span>
    </div>
}

export default Animation;

function getMoveParam(type: AnimateType) {
    let d;
    switch (type) {
        case AnimateType.moveBottom:
        case AnimateType.moveTop:
            d = 'Y'
            break;
        default:
            d = 'X'
            break;
    }

    return {
        direction: d,
        positive: [AnimateType.moveTop, AnimateType.moveLeft].includes(type) ? -1 : 1
    }
}

function getNextStatus(iState: Interaction['state'],
    config: {
        show: boolean;
        visibility: boolean;
        animationType: AnimateType;
        childrenWidth?: number;
        position: {
            x: number,
            y: number
        }
    }) {

    const { position, animationType, show, visibility, childrenWidth = 0 } = config;

    const box = [AnimateType.boxFlipTB, AnimateType.boxFlipLF].includes(animationType);
    const flipX = [AnimateType.flipLateral, AnimateType.flipVertical].includes(animationType);
    const move = [AnimateType.moveBottom, AnimateType.moveLeft, AnimateType.moveRight, AnimateType.moveTop].includes(animationType);

    const { translateToX, translateToY, scaleX = 1, scaleY = 1, transformOrigin, rotate } = iState;
    const transformValues: string[] = [];
    let transformOriginValue = '100% 100%';

    if (move) {
        const { direction, positive } = getMoveParam(animationType);
        const start = (!show && visibility);
        let x = 0; let y = 0; const z = 0;
        if (direction === 'X' && start) {
            x = positive * childrenWidth;
        } else if (direction === 'Y' && start) {
            y = positive * childrenWidth;
        }
        transformValues.push(`translate3d(${x}px ,${y}px ,${z}px)`);
    } else if (isNumber(translateToX) && isNumber(translateToY)) {
        transformValues.push(
            `translate3d(${translateToX - position.x}px, ${translateToY - position.y}px, 0px)`,
        );
    } else if (box) {
        if ((!show && visibility)) {
            if (animationType === AnimateType.boxFlipLF) {
                // 左右
                transformValues.push(
                    `translate3d(-${childrenWidth}px, 0px, 0px)`,
                );
            } else {
                transformValues.push(
                    `translate3d(0px, -${childrenWidth}px, 0px)`,
                );
            }

        } else {
            transformValues.push(
                `translate3d(0px, 0px, 0px)`,
            );
        }
    } else {
        transformValues.push(
            `translate3d(0px, 0px, 0px)`,
        );
    }

    transformValues.push(`scaleX(${scaleX}) scaleY(${scaleY})`);
    transformOriginValue = transformOrigin as string;

    if (flipX) {
        transformValues.push(`perspective(500px)`);
        // 动画开始的时候要0度，动画结束后（visibility = false） 也要0度。180翻转，只要动画过程
        let rotateX = 0; let rotateY = 0;
        const rotateZ = 0;
        const size = (!show && visibility) ? 180 : 0;
        if (animationType === AnimateType.flipLateral) {
            // 横向翻转
            rotateY = size;
        } else {
            rotateX = size;
        }

        transformValues.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`);
    } if (box) {
        // 方盒翻转
        transformValues.push(`perspective(500px)`);
        let rotateX = 0; let rotateY = 0;
        const rotateZ = 0;

        if (animationType === AnimateType.boxFlipLF) {
            // 左右
            if ((!show && visibility)) {
                rotateY = 90
            }
            if (!show && !visibility) {
                // 动画结束了
                rotateY = -90
            }
            transformOriginValue = `left center`;
        } else {
            if ((!show && visibility)) {
                rotateX = 90
            }
            if (!show && !visibility) {
                // 动画结束了
                rotateX = -90
            }
            transformOriginValue = `bottom center`;
        }

        transformValues.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`);

    } else {
        const { rotateX = 0, rotateY = 0, rotateZ = 0, perspective } = rotate || {};
        transformValues.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`);
        if (perspective) {
            transformValues.unshift('perspective(500px)');
        }
    }

    if (transformValues.length > 0) {
        return {
            transform: transformValues.join(' '),
            transformOrigin: transformOriginValue,
        };
    }
    return {
        transform: "translate3d(0px,0px,0px)",
        transformOrigin: transformOriginValue
    };
}