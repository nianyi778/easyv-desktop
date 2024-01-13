import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useEffect, useMemo } from 'react';
import { useRafInterval } from 'ahooks';
import { useCustomEvent } from '@/pages/hooks/useCustomEvent';
import { useEvents } from '@/pages/hooks';
import { AnimateType } from '@/constants';
import Animation from '@/components/Animation';

const MAX_DELAY = 2147483;

function PanelAnimation({ states, config, id, type }: { config: TransformPanelType['config']; id: string; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, animateType = AnimateType.ShowHide } = config;
    const { switchPanelState } = useCustomEvent(id);
    const panelEvent = useEvents('panel', id);

    const panelState = useMemo(() => {
        if (panelEvent) {
            const { type, state, animation } = panelEvent;
            const { duration, delay } = animation;
            return {
                duration,
                delay,
                type,
                ...state
            }
        }
        return null;
    }, [panelEvent]);


    const clear = autoCarousel && useRafInterval(() => {
        switchPanelState(id);
    }, (interval >= MAX_DELAY ? MAX_DELAY : interval) * 1000);

    useEffect(() => {
        () => clear && clear();
    }, [clear]);

    const {
        scaleX,
        scaleY,
        transformOrigin,
        show = true, stateId, unmount = false, duration = 600, delay = 0, type: animationType
    } = panelState || {};

    const curState = stateId || states[0];

    return states.concat().reverse().map(screen => <Animation key={screen}
        type={(animationType || animateType) as AnimateType}
        config={{
            visible: curState === screen && show as boolean,
            delay,
            unmount,
            scaleX,
            scaleY,
            transformOrigin,
            childrenWidth: width,
            animationDuration: duration,
        }} >
        <Panel screenId={screen} width={width} type={type} height={height} />
    </Animation >
    )
}

export default memo(PanelAnimation);

