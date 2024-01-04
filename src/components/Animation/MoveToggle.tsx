import { useSpring, animated } from '@react-spring/web';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { AnimationState, Config } from './index';
import { AnimateType } from '@/constants';

export default function MoveToggle({ children, config, type }: { children: ReactNode, config: Config; type: AnimateType }) {
    const { visible, childrenWidth = 200, unmount } = config;
    const ref = useRef(null);
    const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.default);
    const { direction, positive } = useMemo(() => {
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

    const springConfig = useMemo(() => {
        return visible ? {
            opacity: 1,
            display: 'block',
            transform: `translate${direction}(0px)`,
        } : {
            to: [
                {
                    display: 'block',
                    opacity: 0,
                    transform: `translate${direction}(${positive * childrenWidth}px)`
                },
                // {
                //     opacity: 0,
                //     transform: `translate${direction}(0px)`,
                //     display: 'none'
                // },
            ],
        }
    }, [visible, direction, childrenWidth, positive]);

    const props = useSpring({
        ...springConfig,
        onStart() {
            setAnimationState(AnimationState.start);
        },
        onRest(_, ctrl) {

            // 状态重置
            !visible && ctrl.set({
                transform: `translate${direction}(0px)`,
                display: 'none'
            });

            setAnimationState(AnimationState.end);
        },
    });

    if (unmount && !visible && animationState === AnimationState.end) {
        return null;
    }

    return <animated.div style={props} ref={ref} >
        {children}
    </animated.div>
}