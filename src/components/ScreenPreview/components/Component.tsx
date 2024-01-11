import { getComponentConfig, getComponentDimension } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';
import { TransformComponentType } from '@/type/screen.type';
import { memo, useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash-es';
import { Interaction } from '@/type/Interactions.type';
import Animation, { defaultAnimation } from '@/components/Animation'
import { AnimateType } from "@/constants";

interface Props {
    id: number; component: TransformComponentType; children?: TransformComponentType[];
    event: Interaction | null
}

function Component({ id, component, children = [], event: groupEvent }: Props) {

    const { uniqueTag, config, name, dataConfigs, events, autoUpdate, actions } = component;
    const { width, height, left, top } = getComponentDimension(config);

    const ref = useRef(defaultAnimation);
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
            ref.current = newConfig;
            return newConfig;
        }
        return ref.current;
    }, [groupEvent]);

    useEffect(() => {
        // console.log('auto', autoUpdate,id);
    }, [autoUpdate])

    const { data } = dataConfigs['static'];
    // console.log(children, 'children');

    const childrenConfig = children.map((child) => {
        const {
            id,
            base,
            config,
            dataConfigs,
            dataType,
            autoUpdate,
            actions = [],
            events = [],
            dataFrom,
        } = child;

        return {
            id,
            base,
            configuration: getComponentConfig(config),
            dataType,
            dataConfig: dataConfigs[dataType],
            autoUpdate,
            dataFrom,
            actions,
            events,
        };
    });

    // const childrenData = children.map((child, i) => {
    //     const {
    //         id: childId,
    //         dataConfigs = {},
    //         dataType,
    //         useFilter,
    //         dataFrom,
    //         dataContainers = [],
    //         name,
    //     } = child;
    //     const { data: childData = [], fields = [] } = dataConfigs[dataType] || {};
    //     // eslint-disable-next-line @typescript-eslint/no-shadow
    //     const isChildDataContainer = dataFrom === DataFrom.DATA_CONTAINER;
    //     const newChildComponentData = filterContainersResult(
    //         dataContainers.map((d) => dataFilterResult?.[d.id]),
    //     );
    //     let childComponentData = isChildDataContainer ? newChildComponentData : childData;

    //     if (useFilter) {
    //         childComponentData = filterData({
    //             data: childComponentData,
    //             filters: childrenFilters[i],
    //             callbackValues: childrenFilterCallbackValues[i],
    //             id,
    //             name,
    //         });
    //         if (childComponentData === undefined || childComponentData?.isError) {
    //             childComponentData = [];
    //         }
    //     }
    //     childComponentData = mappingData(childComponentData, fields);

    //     return {
    //         id: childId,
    //         dataType,
    //         data: childComponentData,
    //         callbackValues: childrenInteractionCallbackValues[i],
    //     };
    // });

    const childrenEvents = children.map((child) => {
        const { id, base, events } = child;

        return {
            id,
            base,
            events: events || [],
        };
    });


    return <div
        id={id + ''}
        style={{
            width,
            height,
            left: left, top: top,
        }}
        className={`absolute pointer-events-none`}
    >
        <div
            className={`absolute`}
            style={{
                left: -1 * left, top: -1 * top,
            }}>
            <Animation type={AnimateType.opacity} config={{
                visible: show,
                animationDuration: duration / 1000,
                unmount: unmount
            }}>
                <EasyVComponent
                    uniqueTag={uniqueTag}
                    data={data}
                    id={id}
                    base={component.base}
                    name={name}
                    actions={actions}
                    childrenData={[]}
                    childrenConfig={childrenConfig}
                    childrenEvents={childrenEvents}
                    events={events}
                    config={config}
                    left={left}
                    top={top}
                    width={width}
                    height={height}
                />
            </Animation>

        </div>
    </div>
}

function areEqual(props: Props, nextProps: Props) {

    return props.id === nextProps.id
        && isEqual(props.component, nextProps.component)
        && isEqual(props.children, nextProps.children)
        && isEqual(props.event, nextProps.event)
}

// memo 必须留着
export default memo(Component, areEqual)