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
            to: async (next: any) => {
                if (animationState === AnimationState.default || (props?.opacity && props?.opacity.goal === 0)) {
                    await next({
                        transform: `translate${direction}(0px)`,
                        visibility: 'hidden',
                        opacity: 0,
                    });
                } else {
                    await next({
                        visibility: 'visible',
                        opacity: 0,
                        transform: `translate${direction}(${positive * childrenWidth}px)`
                    })
                }

            }
        }
    }, [visible, direction, childrenWidth, positive]);

    const props = useSpring<{
        visibility: "hidden" | "visible",
        opacity: number;
    }>({
        ...springConfig,
        config: {
            duration: (animationDuration * 1000)
        },
        onStart() {
            setAnimationState(AnimationState.start);
        },
        onRest(_, ctrl) {
            // 状态重置
            !visible && ctrl.set(async (next: any) => await next(
                {
                    transform: `translate${direction}(0px)`,
                    visibility: 'hidden'
                }
            ));

            setAnimationState(AnimationState.end);
        },
    });

    if (unmount && !visible && (animationState === AnimationState.end || animationState === AnimationState.default)) {
        return null;
    }

    return <animated.div style={props} ref={ref} >
        {children}
    </animated.div>
}