import { getScreenData, cleanLargeScreenData } from "@/utils";
import { useSetRecoilState } from 'recoil';
import { screens, filter, panel, container, comContainer } from '@/dataStore';
import { arrayToObj } from '@lidakai/utils'

export function useGetScreen(id: number | string) {
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filter);
    const setPanelsById = useSetRecoilState(panel);
    const setContainersById = useSetRecoilState(container);
    const setComContainersById = useSetRecoilState(comContainer);

    if (id) {
        const data = getScreenData(id);
        if (data) {
            const result = cleanLargeScreenData(data);

            const { filters = [], screens = [], panel = [], containers = [], componentContainers = [] } = result;
            setFilters(filters);
            setScreensById(arrayToObj(screens));
            setPanelsById(arrayToObj(panel));
            setContainersById(arrayToObj(containers));
            setComContainersById(arrayToObj(componentContainers));

            return result;
        }
    }
    return null;
}