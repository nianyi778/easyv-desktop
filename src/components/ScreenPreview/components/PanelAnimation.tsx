import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useEffect } from 'react';
import { useRafInterval } from 'ahooks';
import { useCustomEvent } from '@/pages/hooks/useCustomEvent';
import { useEvents } from '@/pages/hooks';
import Animation from '@/components/Animation/AutoAnimation';
import { AnimateType, MAX_DELAY } from '@/constants';


function PanelAnimation({ states, config, id, type }: { config: TransformPanelType['config']; id: string; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, left, top, animationDuration = 1 } = config;
    const duration = animationDuration * 1000;
    const { switchPanelState } = useCustomEvent(id);
    const panelEvent = useEvents('panel', id);

    const { iState,
        iActiveState,
        bindedInteractionState, } = panelEvent || {};
    console.log(
        config, panelEvent, id
    )

    const clear = autoCarousel && useRafInterval(() => {
        switchPanelState(id);
    }, (interval >= MAX_DELAY ? MAX_DELAY : interval) * 1000);

    useEffect(() => {
        () => clear && clear();
    }, [clear]);

    const { stateId } = iState || {};
    const curState = stateId || states[0];

    function getParams(stateId: number) {
        const currentState = (iState && iState[stateId]) ?? {};
        const { unmount = true, animation, activeState } = currentState;
        const { key = AnimateType.opacity } = iActiveState?.animation ?? {};
        const newAnimation = (activeState?.animation || animation) || {};
        const { config } = newAnimation;
        const newConfig = {
            ...config,
            duration
        }
        return {
            unmount,
            animation: { ...newAnimation, config: newConfig },
            key,
        };
    }

    return <Animation
        id={id}
        duration={duration}
        size={
            {
                width,
                height,
                left,
                top
            }
        }
        iState={iState}
        iActiveState={iActiveState}
    >
        <div id={id}
            className=" absolute overflow-hidden"
            style={{
                width,
                height,
                left: 0,
                top: 0,
            }}>
            {
                states.concat().reverse().map(screen => {
                    const { key, animation, unmount } = getParams(screen);
                    return <Animation
                        key={screen}
                        id={screen}
                        duration={duration}
                        iState={{ key: key, show: curState === screen, unmount: false }}
                        iActiveState={
                            animation ? { animation: { ...animation, key } } : undefined
                        }
                        size={
                            {
                                width,
                                height,
                                left: 0,
                                top: 0
                            }
                        }
                        childrenWidth={width}
                    >
                        <Panel screenId={screen} width={width} type={type} height={height} />
                    </Animation >
                })
            }

        </div>
    </Animation>
};

export default memo(PanelAnimation);

