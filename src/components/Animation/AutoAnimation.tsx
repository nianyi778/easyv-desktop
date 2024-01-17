import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { AnimateType, defaultAnimation } from "@/constants";
import { isNumber } from "lodash-es";
import { Interaction } from "@/type/Interactions.type";


type AnimationProps = {
    children: React.ReactNode;
    type?: AnimateType;
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
    type = AnimateType.opacity,
}: AnimationProps) => {

    const { animation = defaultAnimation } = iActiveState || {};
    const {
        key,
        from,
        to,
        config
    } = animation;
    const { timingFunction, duration: transFormDuration } = config;

    const { show = true, unmount = true } = iState;
    const { width, height, left, top } = size;
    const flipX = [AnimateType.flipLateral, AnimateType.flipVertical].includes(type);
    const move = [AnimateType.moveBottom, AnimateType.moveLeft, AnimateType.moveRight, AnimateType.moveTop].includes(type);

    const [visibility, setVisibility] = useState(show);

    useEffect(() => {
        show && setVisibility(show);
    }, [show])

    const { transform, transformOrigin } = getNextStatus(iState, {
        x: left, y: top
    });

    const display: 'visible' | 'hidden' = visibility ? 'visible' : 'hidden';

    const spring = useSpring({
        width: width,
        height: height,
        left: left,
        top: top,
        transformOrigin: transformOrigin,
        visibility: display,
        transform: transform,
        transition: `transform ${duration}ms ${timingFunction},opacity ${transFormDuration}ms ${timingFunction}`,
        opacity: show ? 1 : 0,
        onRest(result) {
            if (result.value.opacity === 0) {
                setVisibility(false);
            }
        },
    });

    if (unmount && !visibility) {
        return null;
    }

    return (
        <>
            <animated.div style={spring} id={`animation_${id}`} className={' absolute'}>{children}</animated.div>
        </>
    );
};

export default Animation;


function getNextStatus(iState: Interaction['state'], position: {
    x: number,
    y: number
}) {
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


    const { rotateX = 0, rotateY = 0, rotateZ = 0, perspective } = rotate || {};
    transformValues.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`);
    if (perspective) {
        transformValues.unshift('perspective(500px)');
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