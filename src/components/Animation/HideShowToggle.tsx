import { ReactNode } from "react";
import { useSpring, animated } from '@react-spring/web';
import { Config } from './index';

/**
 * @description 显示/隐藏 切换
 * */
export default function HideShowToggle({ children, config }: { children: ReactNode, config: Required<Config> }) {
    const { visible, unmount, animationDuration = 1 } = config;

    const springConfig = visible ? {
        opacity: 1,
        transform: 'translateY(0px)'
    } : {
        opacity: 0,
        transform: 'translateY(-20px)'
    }
    const props = useSpring({
        ...springConfig, config: {
            duration: (animationDuration * 1000)
        },
    });



    if (unmount && !visible) {
        return null;
    }

    return (
        <animated.div style={props}>
            {children}
        </animated.div>
    )
}