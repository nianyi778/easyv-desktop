import { comContainers, components, containers, filters, panels, screens, sources } from "@/dataStore";
import { ScreenPreviewType, TransformComponentContainerType, TransformComponentType, TransformFilterType } from "@/type/screen.type";
import { getScreenData, cleanLargeScreenData, } from "@/utils";
import { arrayToObj, } from "@lidakai/utils";
import { useCallback, } from "react";
import { useSetRecoilState } from "recoil";
import { useInitEvent } from "./useInteraction";
import { useCallbackUpdate } from '@/pages/hooks/useCallback';

export function useGetScreen(): (id: number | string) => Promise<ScreenPreviewType | null> {
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filters);
    const setPanelsById = useSetRecoilState(panels);
    const setContainersById = useSetRecoilState(containers);
    const setComContainersById = useSetRecoilState(comContainers);
    const setComponentsById = useSetRecoilState(components);
    const setSourcesById = useSetRecoilState(sources);
    const { updateCallbackKeys } = useCallbackUpdate();
    // const handleEventInit = useInitEvent();

    const getScreeData = useCallback(async (id: number | string) => {
        if (id) {
            const data = await getScreenData(id);
            if (data) {
                const result = cleanLargeScreenData(data);
                if (result) {
                    const { filters = [], screens = [], panel = [], containers = [], componentContainers = [], components, source } = result;

                    await setFilters(f => f.concat(filters));
                    await setSourcesById(s => ({ ...s, ...arrayToObj(source, 'dataId') }));
                    await setScreensById(s => ({ ...s, ...arrayToObj(screens) }));
                    await setPanelsById((p => ({ ...p, ...arrayToObj(panel) })));
                    await setContainersById(c => ({ ...c, ...arrayToObj(containers) }));
                    await setComContainersById(c => ({ ...c, ...arrayToObj(componentContainers) }));

                    // 事件初始化
                    // await Promise.all(result.screens.map(screen => {
                    //     const { layers, componentContainerId } = screen;
                    //     return handleEventInit({
                    //         components,
                    //         isContainerSubScreen: !!componentContainerId,
                    //         layers: layers,
                    //     })
                    // }))

                    await setComponentsById(c => ({ ...c, ...arrayToObj(components) }));


                    console.log(
                        components, componentContainers, filters
                    );

                    const keys = statisticsCallbackKeys({
                        filters,
                        components,
                        componentContainers
                    })

                    return result;
                }
            }
        }
        return null;
    }, [])

    return getScreeData;
}



function statisticsCallbackKeys({
    filters,
    components,
    componentContainers
}: {
    filters: TransformFilterType[];
    components: TransformComponentType[];
    componentContainers: TransformComponentContainerType[];
}) {
    const filterKeys = filters.reduce<Record<number, unknown[]>>((all, cur) => {
        if (Array.isArray(cur.callbackKeys) && cur.callbackKeys.length) {
            // 存在
            if (Object.keys(all).includes(cur.parentId + '')) {
                // 之前存在
                all[cur.parentId] = all[cur.parentId].concat(cur.callbackKeys)
            } else {
                // 不存在
                all[cur.parentId] = cur.callbackKeys;
            }
        }
        return all;
    }, {});

    const dataKeys = components.reduce<Record<number, unknown[]>>((all, cur) => {

        return all;
    }, {});
}

