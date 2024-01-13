import { ReactNode } from "react";
import { useSpring, animated } from '@react-spring/web';
import { Config } from './index';

/**
 * @description 缩放
 * */
export default function Scale({ children, config }: { children: ReactNode, config: Required<Config> }) {
    const { scaleX, scaleY, transformOrigin, animationDuration = 1000, delay = 0 } = config;



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
        <animated.div style={props}>
            {children}
        </animated.div>
    )
}

