import { Layer } from '@/type/screen.type';
import Home from './index';
import { memo } from 'react';
import Animation, { defaultAnimation } from '@/components/Animation'
import { AnimateType } from "@/constants";
import { useMemo } from "react";
import { Interaction } from '@/type/Interactions.type';
interface Props { width: number, height: number; layers: Layer[]; event: Interaction | null }

function Group({ width, height, layers, event: groupEvent }: Props) {
    const {
        show,
        unmount,
        delay,
        type,
        timingFunction,
        duration
    } = useMemo(() => {
        if (groupEvent) {
            const { animation, state } = groupEvent;
            const { show, unmount } = state;
            const { delay, duration, type, timingFunction } = animation;
            const newConfig = {
                ...defaultAnimation,
                show: show as boolean,
                unmount,
                delay,
                type,
                timingFunction,
                duration
            }
            return newConfig;
        }
        return defaultAnimation
    }, [groupEvent]);

    return <Animation type={AnimateType.opacity} config={{
        visible: show,
        animationDuration: duration,
        unmount: unmount
    }}>
        <div style={{
            width,
            height,
        }}>
            <Home layers={layers}></Home>
        </div>
    </Animation>


}


export default memo(Group);