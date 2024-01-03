import { getComponentConfig, getComponentDimension } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';
import { TransformComponentType } from '@/type/screen.type';
import { memo, useEffect } from 'react';

function Component({ id, component, children = [] }: { id: number; component: TransformComponentType; children?: TransformComponentType[] }) {

    const { uniqueTag, config, name, dataConfigs, events, autoUpdate, actions } = component;
    const { width, height, left, top } = getComponentDimension(config);

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
            <EasyVComponent
                uniqueTag={uniqueTag}
                data={data}
                id={id} base={component.base} name={name} actions={actions} childrenData={[]} childrenConfig={childrenConfig} childrenEvents={childrenEvents} events={events} config={config} left={left} top={top} width={width} height={height} />
        </div>
    </div>
}

// memo 必须留着
export default memo(Component)