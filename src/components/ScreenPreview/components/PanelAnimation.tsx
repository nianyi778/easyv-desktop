import { PanelType, TransformPanelType } from '@/type/screen.type';
import Panel from './Panel';
import { memo, useEffect } from 'react';
import { useRafInterval } from 'ahooks';
import { useCustomEvent } from '@/pages/hooks/useCustomEvent';
import { useEvents } from '@/pages/hooks';
import Animation from '@/components/Animation/AutoAnimation';
import { MAX_DELAY } from '@/constants';


function PanelAnimation({ states, config, id, type }: { config: TransformPanelType['config']; id: string; states: number[]; type: PanelType }) {
    const { width, height, autoCarousel, interval = 1, left, top, animationDuration } = config;
    const { switchPanelState } = useCustomEvent(id);
    const panelEvent = useEvents('panel', id);

    const { iState,
        iActiveState,
        bindedInteractionState, } = panelEvent || {};


    const clear = autoCarousel && useRafInterval(() => {
        switchPanelState(id);
    }, (interval >= MAX_DELAY ? MAX_DELAY : interval) * 1000);

    useEffect(() => {
        () => clear && clear();
    }, [clear]);

    const { stateId } = iState || {};
    const curState = stateId || states[0];

    function getParams(stateId: number) {
        const currentState = (iState && iState[stateId]) || {};
        const { unmount = true, animation, activeState } = currentState;
        return {
            unmount,
            animation: activeState?.animation || animation,
        };
    }

    return <Animation
        id={id}
        duration={animationDuration}
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
                    const animationParams = getParams(screen);
                    return <Animation
                        key={screen}
                        id={screen}
                        iState={{ key: 'show', show: curState === screen, unmount: false }} //  animationParams.unmount
                        iActiveState={
                            animationParams.animation ? { animation: animationParams.animation } : undefined
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

