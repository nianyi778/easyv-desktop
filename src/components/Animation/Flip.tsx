import { ReactNode, useEffect, useRef, useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { AnimationState, Config } from './index';

/**
 * @description 绕轴反转
 * */
export default function Flip({ children, config }: { children: ReactNode, config: Required<Config> }) {
    const { visible, unmount, animationDuration = 1 } = config;
    const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.default);

    const springConfig = visible ? {
        visibility: 'visible',
        opacity: 1,
        transform: 'rotateX(0deg)',
        transformOrigin: 'center',
    } : {
        to: async (next: any) => {
            await next({
                visibility: 'visible',
                opacity: 0,
                transform: 'rotateX(180deg)'
            })
        }
    }
    const props = useSpring<{
        opacity: number;
        transform: string
    }>({
        ...springConfig,
        config: {
            duration: (animationDuration)
        },
        async onStart(_, ctrl) {
            // 状态重置
            visible && await ctrl.set({
                transform: 'rotateX(0deg)',
            })
            setAnimationState(AnimationState.start);
        },
        async onRest(_, ctrl) {
            !visible && await ctrl.set({
                visibility: 'hidden',
                opacity: 0,
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

