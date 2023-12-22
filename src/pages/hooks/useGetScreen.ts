import { comContainers, components, containers, filters, panels, screens } from "@/dataStore";
import { ScreenPreviewType } from "@/type/screen.type";
import { getScreenData, cleanLargeScreenData } from "@/utils";
import { arrayToObj } from "@lidakai/utils";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export function useGetScreen(id: number | string) {
    const [screenData, setData] = useState<ScreenPreviewType>();
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filters);
    const setPanelsById = useSetRecoilState(panels);
    const setContainersById = useSetRecoilState(containers);
    const setComContainersById = useSetRecoilState(comContainers);
    const setComponentsById = useSetRecoilState(components);

    useEffect(() => {
        if (id) {
            const data = getScreenData(id);
            if (data) {
                const result = cleanLargeScreenData(data);
                if (result) {
                    const { filters = [], screens = [], panel = [], containers = [], componentContainers = [], components } = result;
                    setFilters(filters);
                    setScreensById(arrayToObj(screens));
                    setPanelsById(arrayToObj(panel));
                    setContainersById(arrayToObj(containers));
                    setComContainersById(arrayToObj(componentContainers));
                    setComponentsById(arrayToObj(components));
                    setData(result);
                }
            }
        }
    }, [id]);

    return screenData;
}