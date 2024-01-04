import { useSpring, animated } from '@react-spring/web';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { AnimationState, Config } from './index';
import { AnimateType } from '@/constants';

export default function MoveToggle({ children, config, type }: { children: ReactNode, config: Required<Config>; type: AnimateType }) {
    const { visible, childrenWidth, unmount, animationDuration } = config;
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
            visibility: 'visible',
            transform: `translate${direction}(0px)`,
        } : {
            to: [
                {
                    visibility: 'visible',
                    opacity: 0,
                    transform: `translate${direction}(${positive * childrenWidth}px)`
                },
            ],
        }
    }, [visible, direction, childrenWidth, positive]);

    const props = useSpring({
        ...springConfig,
        config: {
            duration: (animationDuration * 1000)
        },
        onStart() {
            setAnimationState(AnimationState.start);
        },
        onRest(_, ctrl) {

            // 状态重置
            !visible && ctrl.set({
                transform: `translate${direction}(0px)`,
                visibility: 'hidden'
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