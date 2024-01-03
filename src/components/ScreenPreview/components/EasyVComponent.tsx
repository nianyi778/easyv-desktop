import { useCallback, useEffect, useState } from 'react';
import { define } from '@/utils/define';
import { TransformComponentType } from '@/type/screen.type';
import LoadingSpinner from '@/components/LoadingAnimation';
import ComponentEmpty from '@/components/ComponentEmpty';
import ErrorBoundary from './ComErrorBoundary';
import { getComponentConfig } from '@lidakai/utils';
import { ChildrenConfig } from '@/type/component.type';
// import Parent from './Test';

interface EasyVComponentType {
    config: unknown[];
    name: string;
    id: number; base: TransformComponentType['base']; spaceId?: number;
    height: number; width: number; left: number; top: number;
    uniqueTag: string;
    data: unknown[];
    events: unknown[];
    childrenData: unknown[];
    childrenConfig: ChildrenConfig[];
    childrenEvents: unknown[];
    actions?: unknown[]
}

export default function EasyVComponent(
    { id, base, spaceId, uniqueTag, height, name, events, config, actions, width, left, top, data, childrenData, childrenConfig, childrenEvents }: EasyVComponentType) {
    const [loadedScript, setLoadedScript] = useState(false);
    const [component, setComponent] = useState<any>(null);
    useEffect(() => {
        const { version, module_name } = base;
        if (version && module_name) {
            // 加载组件js
            const random = Math.random();
            define(
                `com_${id}_${random}`,
                [`${module_name}@${version}`],
                (com: any) => {
                    if (!window.component) {
                        window.component = {};
                    }
                    window.component[`${module_name}@${version}`] = com;
                    setComponent((_: any) => com);
                    setLoadedScript(true)
                },
                spaceId,
            );
        }

    }, [base, spaceId]);

    const getCallbackValue = useCallback(() => { }, []);
    const handleEmit = useCallback(() => { }, []);
    const postMessage = useCallback(() => { }, []);
    const handleEmitEvent = useCallback(() => { }, []);

    if (!loadedScript) {
        return (
            <LoadingSpinner
                style={{
                    left,
                    top,
                    width,
                    height,
                    position: 'absolute',
                }}
            />
        );
    }

    if (!component || !id) {
        return <ComponentEmpty
            text={`${id}-${name}(加载失败)`}
            style={{
                width,
                height,
                lineHeight: height + 'px',
            }} />
    }


    const iState = {
        show: true
    };
    const bindedInteractionState = {};
    const interactionCallbackValues = {}



    const Com = component;

    return <ErrorBoundary customErrorChildren={
        <ComponentEmpty
            text={`${id}-${name}组件 (加载失败)`}
            style={{
                width,
                height,
                left,
                top,
                position: 'absolute',
                lineHeight: height + 'px',
                backgroundColor: 'transparent'
            }} />
    } >
        <div id={uniqueTag}
            style={{
                position: 'absolute',
                pointerEvents: 'auto',
            }}>
            {/* <Parent id={id} /> */}
            <Com
                id={id}
                data={data || []}
                configuration={getComponentConfig(config)}
                actions={actions || []}
                events={events || []}
                width={width}
                height={height}
                top={top}
                left={left}
                iState={iState}
                bindedInteractionState={bindedInteractionState}
                childrenData={childrenData || []}
                childrenConfig={childrenConfig || []}
                callbackValues={interactionCallbackValues}
                childrenEvents={childrenEvents}
                emitEvent={handleEmitEvent}
                postMessage={postMessage}
                emit={handleEmit}
                getCallbackValue={getCallbackValue}
                onRelative={(...args: any[]) => {
                    console.log(args);
                }}
            />
        </div>

    </ErrorBoundary>

}