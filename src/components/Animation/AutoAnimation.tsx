import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { AnimateType, defaultAnimation } from "@/constants";
import { isNumber } from "lodash-es";
import { Interaction } from "@/type/Interactions.type";


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
        config
    } = animation;
    const { timingFunction, duration: transFormDuration } = config;

    const { show = true, unmount = true } = iState;
    const { width, height, left, top } = size;

    const [visibility, setVisibility] = useState(show as boolean);

    useEffect(() => {
        show && setVisibility(show as boolean);
    }, [show])

    console.log(
        key, id
    )
    const { transform, transformOrigin } = getNextStatus(iState, {
        x: left, y: top
    }, {
        animationType: key,
        visibility
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


function getNextStatus(iState: Interaction['state'],
    position: {
        x: number,
        y: number
    }, config: {
        animationType: AnimateType;
        visibility: boolean
    }) {
    const {
        animationType,
        visibility
    } = config;

    const flipX = [AnimateType.flipLateral, AnimateType.flipVertical].includes(animationType);
    const move = [AnimateType.moveBottom, AnimateType.moveLeft, AnimateType.moveRight, AnimateType.moveTop].includes(animationType);

    // console.log(move, flipX);

    const { translateToX, translateToY, scaleX = 1, scaleY = 1, transformOrigin, rotate } = iState;
    const transformValues: string[] = [];
    let transformOriginValue = '100% 100%';

    // rotateX(180deg)
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
        if (visibility) {
            transformValues.push(`rotateX(0deg) rotateY(0deg) rotateZ(0deg)`);
        } else {
            transformValues.push(`rotateX(180deg) rotateY(0deg) rotateZ(0deg)`);
        }
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