import { ReactNode, useEffect, useRef, useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { AnimationState, Config } from './index';

/**
 * @description 绕轴反转
 * */
export default function Flip({ children, config }: { children: ReactNode, config: Required<Config> }) {
    const { visible, unmount, animationDuration = 1 } = config;
    const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.default);
    const ref = useRef(false);

    useEffect(() => {
        if (visible && !ref.current) {
            ref.current = true;
            setAnimationState(AnimationState.end);
        }
    }, [visible])



    const springConfig = visible ? {
        visibility: 'visible',
        opacity: 1,
        transform: 'rotateX(0deg)',
        transformOrigin: 'center',
    } : {
        to: async (next: any) => {
            if (animationState === AnimationState.default) {
                await next({
                    opacity: 0,
                    visibility: 'hidden',
                    transform: 'rotateX(180deg)'
                });
            } else {
                await next({
                    visibility: 'visible',
                    opacity: 0,
                    transform: 'rotateX(180deg)'
                })
            }

        }
    }
    const props = useSpring<{
        opacity: number;
        transform: string
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
                visibility: 'hidden',
                transform: 'rotateX(0deg)'
            })
            setAnimationState(AnimationState.end);
        },
    });


    if (unmount && !visible && animationState === AnimationState.end) {
        return null;
    }

    return (
        <animated.div style={props} className={' absolute w-full h-full'}>
            {children}
        </animated.div>
    )
}

