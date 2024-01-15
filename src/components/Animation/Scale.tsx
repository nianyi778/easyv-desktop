import { ReactNode } from "react";
import { useSpring, animated } from '@react-spring/web';
import { Config } from './index';

/**
 * @description 缩放
 * */
export default function Scale({ children, config, visible }: { children: ReactNode, config: Required<Config>; visible: boolean }) {
    const { scaleX = 1, scaleY = 1, transformOrigin, animationDuration = 1000, delay = 0 } = config;



    const springConfig = {
        transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
        transformOrigin
    }
    const props = useSpring<{
        opacity: number;
    }>({
        ...springConfig,
        delay: delay,
        config: {
            duration: animationDuration,
        },
    });

    return (
        <animated.span style={props}>
            {children}
        </animated.span>
    )
}

