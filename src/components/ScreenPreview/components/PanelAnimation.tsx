import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useEffect, useMemo } from 'react';
import { useRafInterval } from 'ahooks';
import { useCustomEvent } from '@/pages/hooks/useCustomEvent';
import { useEvents } from '@/pages/hooks';
import { AnimateType } from '@/constants';
import Animation from '@/components/Animation/AutoAnimation';

const MAX_DELAY = 2147483;

function PanelAnimation({ states, config, id, type }: { config: TransformPanelType['config']; id: string; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, left, top } = config;
    const { switchPanelState } = useCustomEvent(id);
    const panelEvent = useEvents('panel', id);

    const panelState = useMemo(() => {
        if (panelEvent) {
            const { type, state, animation } = panelEvent;
            const { duration, delay, type: animationType } = animation;
            return {
                duration,
                delay,
                type,
                animationType,
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
        show = true, stateId, unmount = false, duration = 600, animationType
    } = panelState || {};

    const curState = stateId || states[0];

    if (id === 'panel_13042') {
        console.log(curState, '--=--=13042')
    }

    return <div id={id}
        className=" absolute overflow-hidden"
        style={{
            width,
            height,
            left,
            top,
        }}>
        {
            states.concat().reverse().map(screen => <Animation key={screen}
                show={curState === screen && show as boolean}
                unmount={unmount}
                childrenWidth={width}
                type={animationType}
                duration={duration}
                flipX={true}
            >
                <Panel screenId={screen} width={width} type={type} height={height} />
            </Animation >)
        }

    </div>
};

export default memo(PanelAnimation);

