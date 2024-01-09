import { ReactNode, useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { AnimationState, Config } from './index';

/**
 * @description 显示/隐藏 切换
 * */
export default function HideShowToggle({ children, config }: { children: ReactNode, config: Required<Config> }) {
    const { visible, unmount, animationDuration = 1 } = config;
    const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.default);


    const springConfig = visible ? {
        visibility: 'visible',
        opacity: 1,
    } : {
        to: async (next: any) => {
            if (animationState === AnimationState.default || (props?.opacity && props?.opacity.goal === 0)) {
                await next({
                    opacity: 0,
                    visibility: 'hidden'
                });
            } else {
                await next({
                    visibility: 'visible',
                    opacity: 0,
                })
            }

        }
    }
    const props = useSpring<{
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
            !visible && ctrl.set(async (next: any) => await next({
                visibility: 'hidden'
            }));
            setAnimationState(AnimationState.end);
        },
    });


    if (unmount && !visible && animationState === AnimationState.end) {
        return null;
    }

    return (
        <animated.div style={props}>
            {children}
        </animated.div>
    )
}

