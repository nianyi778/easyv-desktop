import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useRafInterval } from 'ahooks';
import Animation from '@/components/Animation';
import { useCustomEvent } from '@/pages/hooks/useCustomEvent';
import { useEvents } from '@/pages/hooks';
import { AnimateType } from '@/constants';


const MAX_DELAY = 2147483;

function PanelAnimation({ states, config, id, type }: { config: TransformPanelType['config']; id: string; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, animateType = AnimateType.opacity } = config;
    const { switchPanelState } = useCustomEvent(id);
    const panelEvent = useEvents('panel', id);


    const panelState = useMemo(() => {
        if (panelEvent) {
            const { show, stateId, unmount } = panelEvent.state;
            const { duration, delay } = panelEvent.animation;
            return {
                show,
                stateId,
                duration,
                delay,
                unmount
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
        show = true, stateId, unmount = false, duration = 600, delay = 0
    } = panelState || {};

    const curState = stateId || states[0];

    console.log(panelState, 'panelState');

    const animationConfig = useCallback((screen: number) => {
        return {
            visible: curState === screen,
            unmount: unmount,
            childrenWidth: width,
            animationDuration: duration,
            animateType
        }
    }, [unmount, width, duration, animateType, curState]);

    return <Animation type={AnimateType.opacity} config={{
        visible: !!show,
        unmount: unmount,
        animationDuration: duration
    }}>
        {
            states.concat().reverse().map(screen => <Panel key={screen} screenId={screen} width={width} type={type} height={height} config={
                animationConfig(screen)
            } />)
        }
    </Animation>
}

export default memo(PanelAnimation);

