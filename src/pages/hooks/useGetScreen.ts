import { comContainers, components, containers, filters, panels, screens } from "@/dataStore";
import { ScreenPreviewType } from "@/type/screen.type";
import { getScreenData, cleanLargeScreenData } from "@/utils";
import { arrayToObj } from "@lidakai/utils";
import { useCallback, } from "react";
import { useSetRecoilState } from "recoil";

export function useGetScreen(): (id: number | string) => Promise<ScreenPreviewType | null> {
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filters);
    const setPanelsById = useSetRecoilState(panels);
    const setContainersById = useSetRecoilState(containers);
    const setComContainersById = useSetRecoilState(comContainers);
    const setComponentsById = useSetRecoilState(components);

    const getScreeData = useCallback(async (id: number | string) => {
        if (id) {
            const data = getScreenData(id);
            if (data) {
                const result = cleanLargeScreenData(data);
                if (result) {
                    const { filters = [], screens = [], panel = [], containers = [], componentContainers = [], components } = result;
                    await setFilters(f => f.concat(filters));
                    await setScreensById(s => ({ ...s, ...arrayToObj(screens) }));
                    await setPanelsById((p => ({ ...p, ...arrayToObj(panel) })));
                    await setContainersById(c => ({ ...c, ...arrayToObj(containers) }));
                    await setComContainersById(c => ({ ...c, ...arrayToObj(componentContainers) }));
                    await setComponentsById(c => ({ ...c, ...arrayToObj(components) }));
                    return result;
                }
            }
        }
        return null;
    }, [])

    return getScreeData;
}