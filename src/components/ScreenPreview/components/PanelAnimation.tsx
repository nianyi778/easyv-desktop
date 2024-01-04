import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useEffect, useState } from 'react';
import { useRafInterval } from 'ahooks';
import Animation from '@/components/Animation';

function PanelAnimation({ states, config, type }: { config: TransformPanelType['config']; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, animationDuration, animateType } = config;
    const initIndex = 0;
    const [index, setIndex] = useState(initIndex);
    const maxLen = states.length;
    const clear = autoCarousel && useRafInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % maxLen);
    }, interval * 1000);

    useEffect(() => {
        () => clear && clear();
    }, [clear]);
    const curState = states[index];

    return states.concat().reverse().map(screen => <Animation key={screen} type={animateType} config={{
        visible: curState === screen,
        unmount: false,
        childrenWidth: width,
        animationDuration
    }}><Panel screenId={screen} width={width} type={type} height={height} /></Animation>)
}

export default memo(PanelAnimation);

