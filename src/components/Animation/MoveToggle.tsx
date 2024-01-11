import { useSpring, animated } from '@react-spring/web';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimationState, Config } from './index';
import { AnimateType } from '@/constants';

export default function MoveToggle({ children, config, type }: { children: ReactNode, config: Required<Config>; type: AnimateType }) {
    const { visible, childrenWidth, unmount, animationDuration } = config;
    const prevCountRef = useRef(false);
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
        let state = animationState;
        if (visible && !prevCountRef.current) {
            prevCountRef.current = true;
            state = AnimationState.end;
            setAnimationState(AnimationState.end);
        }
        return visible ? {
            opacity: 1,
            visibility: 'visible',
            transform: `translate${direction}(0px)`,
        } : {
            to: async (next: any) => {
                if (state == AnimationState.default) {
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
    }, [visible]);

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
        async onRest(_, ctrl) {
            // 状态重置
            !visible && await ctrl.set({
                transform: `translate${direction}(0px)`,
                visibility: 'hidden',
                opacity: 0,
            })

            setAnimationState(AnimationState.end);
        },
    });

    if (unmount && !visible && (animationState === AnimationState.end || animationState === AnimationState.default)) {
        return null;
    }

    return <animated.div style={props}  >
        {children}
    </animated.div>
}