import { ReactNode, useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { AnimationState, Config } from './index';

/**
 * @description 显示/隐藏 切换
 * */
export default function HideShowToggle({ children, config, visible }: { children: ReactNode, config: Required<Config>; visible: boolean }) {
    const { unmount, animationDuration = 1000 } = config;
    const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.default);

    const springConfig = visible ? {
        visibility: 'visible',
        opacity: 1,
    } : {
        to: async (next: any) => {
            await next({
                visibility: 'visible',
                opacity: 0,
            })
        }
    }
    const props = useSpring<{
        opacity: number;
    }>({
        ...springConfig,
        config: {
            duration: animationDuration
        },
        async onStart(_, ctrl) {
            // visible && await ctrl.set({
            //     opacity: 0,
            // })
            setAnimationState(AnimationState.start);
        },
        async onRest(_, ctrl) {
            // 状态重置
            !visible && await ctrl.set({
                visibility: 'hidden',
                opacity: 0,
            })
            setAnimationState(AnimationState.end);
        },
    });


    if (unmount && !visible && animationState === AnimationState.end) {
        // return null;
    }

    return (
        <animated.div style={props}>
            {children}
        </animated.div>
    )
}

