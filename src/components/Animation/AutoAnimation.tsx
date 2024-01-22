import React, { useEffect, useRef, useState } from "react";
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

const Animation = ({
    children,
    size,
    iState = {},
    iActiveState,
    id,
    duration = 1000,
    childrenWidth = 0,
}: AnimationProps) => {

    const { animation = defaultAnimation } = iActiveState || {};
    const {
        key,
        from,
        to,
        config = defaultAnimation.config
    } = animation;
    const { timingFunction = 'linear', duration: transFormDuration } = config;
    const ref = useRef<HTMLDivElement>(null)
    const { show = true, unmount = true } = iState;
    const { width, height, left, top } = size;

    const [visibility, setVisibility] = useState(false);

    const { transform, transformOrigin } = getNextStatus(iState, {
        position: { x: left, y: top },
        animationType: key,
        show: show as boolean,
        visibility
    });

    const display: 'block' | 'none' = visibility ? 'block' : 'none';
    const ease = easeMap[timingFunction] || easeMap.linear;

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
                .on("end", function () {
                    if (!show) {
                        setVisibility(false)
                    }
                });
        }
    }, [show, transFormDuration, ease]);


    const styles = {
        width: width,
        height: height,
        left: left,
        top: top,
        transformOrigin: transformOrigin,
        display,
        transform: transform,
        transition: `transform ${duration}ms ${timingFunction}`, // ,opacity ${transFormDuration}ms ${timingFunction}
    }

    if (unmount && !visibility) {
        return null;
    }

    return <div style={styles} ref={ref} id={`animation_${id}`} className={' absolute'}>
        {children}
    </div>
};

export default Animation;


function getNextStatus(iState: Interaction['state'],
    config: {
        show: boolean;
        visibility: boolean;
        animationType: AnimateType;
        position: {
            x: number,
            y: number
        }
    }) {
    const { position, animationType, show, visibility } = config;

    const flipX = [AnimateType.flipLateral, AnimateType.flipVertical].includes(animationType);
    const move = [AnimateType.moveBottom, AnimateType.moveLeft, AnimateType.moveRight, AnimateType.moveTop].includes(animationType);

    // console.log(move, flipX);


    const { translateToX, translateToY, scaleX = 1, scaleY = 1, transformOrigin, rotate } = iState;
    const transformValues: string[] = [];
    let transformOriginValue = '100% 100%';

    if (isNumber(translateToX) && isNumber(translateToY)) {
        transformValues.push(
            `translate3d(${translateToX - position.x}px, ${translateToY - position.y}px, 0px)`,
        );
    } else {
        transformValues.push(
            `translate3d(0px, 0px, 0px)`,
        );
    }

    transformValues.push(`scaleX(${scaleX}) scaleY(${scaleY})`);
    transformOriginValue = transformOrigin as string;




    if (flipX) {
        // 动画开始的时候要0度，动画结束后（visibility = false） 也要0度。180翻转，只要动画过程
        const rotateX = (!show && visibility) ? 180 : 0, rotateY = 0, rotateZ = 0;
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