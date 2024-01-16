import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { select } from 'd3';
import { AnimateType } from '@/constants';

type AnimationProps = {
    show?: boolean;
    hide?: boolean;
    moveX?: number;
    moveY?: number;
    scaleX?: number;
    scaleY?: number;
    rotate?: number;
    moveIn?: 'up' | 'down' | 'left' | 'right';
    moveOut?: 'up' | 'down' | 'left' | 'right';
    transformOrigin?: string;
    childrenWidth?: number;
    flipX?: boolean;
    unmount?: boolean;
    delay?: number;
    duration?: number;
    children: React.ReactNode;
    type?: AnimateType
};

const Animation: React.FC<AnimationProps> = ({
    show = true,
    moveX = 0,
    moveY = 0,
    scaleX = 1,
    scaleY = 1,
    rotate = 0,
    moveIn,
    type,
    childrenWidth = 0,
    moveOut,
    flipX = false,
    unmount = false,
    delay = 0,
    duration = 500,
    children,
    transformOrigin = "center",
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(show);
    const [isMounted, setIsMounted] = useState<boolean>(true);

    useEffect(() => {
        if (unmount && !show && !isVisible) {
            setIsMounted(false);
        }
    }, [unmount, show, isVisible]);

    useEffect(() => {
        if (isVisible) {
            setIsMounted(true);
        }
    }, [isVisible]);

    const translate = useMemo(() => {
        if (!type) {
            return null
        }
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
    }, [type]);


    useEffect(() => {
        if (isMounted) {
            const container = select('.animation-container');
            if (show) {
                container.style('visibility', 'visible');
            }
            const { positive = 0, direction = 'X' } = translate || {};
            // translate${ direction } (${ positive * childrenWidth }px)
            container.transition()
                .duration(duration)
                .delay(delay)
                .style('opacity', show ? 1 : 0)
                .style('transform', `
                ${!flipX && !show ? 'rotateX(180deg)' : 'rotateX(0deg)'}
                `)
                .on('end', () => {
                    if (!show) {
                        console.log('end', '13042');
                        setIsVisible(false);
                        container.style('visibility', 'hidden');
                    }
                });
            // if (show) {
            //     container.transition()
            //         .duration(duration)
            //         .delay(delay)
            //         .style('opacity', 1);
            // } else {
            //     container.transition()
            //         .duration(duration)
            //         .delay(delay)
            //         .style('opacity', 0)
            //         .on('end', () => {
            //             setIsVisible(false);
            //         });
            // }
        }
    }, [show, isMounted]);

    return isMounted ? (
        <div className="animation-container">
            {children}
        </div>
    ) : null;
};

export default Animation;