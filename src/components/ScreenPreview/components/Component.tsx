import { getComponentConfig, getComponentDimension } from '@easyv/admin-utils';
import EasyVComponent from './EasyVComponent';
import { ComponentRels, DataConfig, DataConfigs, DataType, OtherDataType, TransformComponentType, TransformFilterType } from '@/type/screen.type';
import { memo, useMemo } from 'react';
import Animation from '@/components/Animation/AutoAnimation'
import { useEvents } from "@/pages/hooks";
import { sources } from '@/dataStore';
import { useRecoilValue } from 'recoil';
import useDataGet from '@/pages/hooks/useDataGet';
import { getDataConfig } from '@/utils/source';
interface Props {
    hideDefault?: boolean;
    filters?: TransformFilterType[];
    id: number;
    component: TransformComponentType;
    children?: TransformComponentType[];
    containerIndex?: number;
    containerItemData?: unknown
}

function Component({ id, component, children = [], hideDefault = false, filters = [], containerIndex, containerItemData }: Props) {
    const sourcesById = useRecoilValue(sources);
    const { uniqueTag, config, name, dataConfigs, events, autoUpdate, actions, dataType } = component;
    const { width, height, left, top } = getComponentDimension(config);
    const comEvent = useEvents('component', id);
    const defaultState = {
        show: !hideDefault,
    };

    const dataConfig = useMemo(() => {
        // 缓存一下，否则每次 dataGet hook
        return getDataConfig({
            dataConfigs,
            dataType,
            sourcesById,
            containerItemData
        }) as DataConfig;
    }, [containerItemData, sourcesById, dataType, dataConfigs]);

    const comData = useDataGet({
        filters,
        dataConfig
    });

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


    const { iState, iActiveState, bindedInteractionState } = comEvent || {};
    return <Animation
        id={id}
        iState={iState || defaultState}
        iActiveState={iActiveState}
        size={{
            width,
            left,
            top,
            height
        }}
    >
        <div
            id={`component_${id}`}
            style={{
                width,
                height,
                left: 0, top: 0,
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
                    data={comData}
                    id={id}
                    bindedInteractionState={bindedInteractionState}
                    base={component.base}
                    name={name}
                    iState={iState}
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

            </div>
        </div>
    </Animation>
}

// memo 必须留着
export default memo(Component)