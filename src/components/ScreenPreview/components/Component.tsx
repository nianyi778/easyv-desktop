import { getComponentConfig, getComponentDimension } from '@lidakai/utils';
import EasyVComponent from './EasyVComponent';
import { DataConfigs, DataType, DataTypeNum, OtherDataType, StaticDataType, TransformComponentType } from '@/type/screen.type';
import { memo, useEffect, useMemo, useState } from 'react';
import Animation from '@/components/Animation/AutoAnimation'
import { AnimateType } from "@/constants";
import { useEvents } from "@/pages/hooks";
import { sources } from '@/dataStore';
import { useRecoilValue } from 'recoil';
import { getResourceFile } from '@/utils';
import { ipcRenderer } from 'electron';
interface Props {
    hideDefault?: boolean;
    id: number; component: TransformComponentType; children?: TransformComponentType[];
}

function Component({ id, component, children = [], hideDefault = false }: Props) {
    const sourcesById = useRecoilValue(sources);
    const [comData, setComData] = useState<unknown[]>([]);
    const { uniqueTag, config, name, dataConfigs, events, autoUpdate, actions, dataType } = component;
    const { width, height, left, top } = getComponentDimension(config);
    const comEvent = useEvents('component', id);
    const defaultState = {
        show: !hideDefault,
    };

    const dataConfig = useMemo(() => {
        const data = dataConfigs[dataType];
        if (dataType === DataType.STATIC) {
            return data as DataConfigs['static']
        }
        const newData = data?.data as OtherDataType;
        const dataId = newData?.dataId;
        if (dataId) {
            const current = sourcesById[dataId];
            if (current) {
                return {
                    ...data,
                    data: current
                }
            }
        }
        return {
            ...data,
            data: [],
        };
    }, [dataType, sourcesById]);

    useEffect(() => {
        const { data } = dataConfig as any;
        if (data && data?.dataId) {
            if (
                data.type === DataTypeNum.CSV
            ) {
                const { filepath: filePath, encode } = data.config;
                (async () => {
                    const path = getResourceFile(filePath, false)
                    await ipcRenderer.invoke('source-csv', {
                        path,
                        encode
                    });
                    ipcRenderer.on('source-csv-send', (_, args) => {
                        console.log(args);
                    });
                })()
            }
        } else {
            // filter(xxx);
            // setComData(data);
        }
    }, [autoUpdate, dataConfig])

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
            id={id + ''}
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
                    data={[]}
                    id={id}
                    bindedInteractionState={bindedInteractionState}
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

            </div>
        </div>
    </Animation>
}

// memo 必须留着
export default memo(Component)