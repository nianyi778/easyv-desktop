import { comContainers, components, containers, filters, panels, screens, sources } from "@/dataStore";
import { ScreenPreviewType } from "@/type/screen.type";
import { getScreenData, cleanLargeScreenData, } from "@/utils";
import { arrayToObj, } from "@lidakai/utils";
import { useCallback, } from "react";
import { useSetRecoilState } from "recoil";
import { useInitEvent } from "./useInteraction";

export function useGetScreen(): (id: number | string) => Promise<ScreenPreviewType | null> {
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filters);
    const setPanelsById = useSetRecoilState(panels);
    const setContainersById = useSetRecoilState(containers);
    const setComContainersById = useSetRecoilState(comContainers);
    const setComponentsById = useSetRecoilState(components);
    const setSourcesById = useSetRecoilState(sources);
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
                    // 统计事件
                    return result;
                }
            }
        }
        return null;
    }, [])

    return getScreeData;
}

