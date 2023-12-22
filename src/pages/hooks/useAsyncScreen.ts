import { useSetRecoilState } from 'recoil';
import { screens, filters, panels, containers, comContainers, components } from '@/dataStore';
import { arrayToObj } from '@lidakai/utils'
import { useEffect } from 'react';
import { ScreenPreviewType } from '@/type/screen.type';

export default function useAsyncScreen(screenData: ScreenPreviewType | null, callback?: () => void) {
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filters);
    const setPanelsById = useSetRecoilState(panels);
    const setContainersById = useSetRecoilState(containers);
    const setComContainersById = useSetRecoilState(comContainers);
    const setComponentsById = useSetRecoilState(components);

    useEffect(() => {
        (async () => {
            if (screenData) {
                const { filters = [], screens = [], panel = [], containers = [], componentContainers = [], components } = screenData;
                await setFilters(filters);
                await setScreensById(arrayToObj(screens));
                await setPanelsById(arrayToObj(panel));
                await setContainersById(arrayToObj(containers));
                await setComContainersById(arrayToObj(componentContainers));
                await setComponentsById(arrayToObj(components));
                callback?.();
            }
        })()

    }, [screenData])

    return null;
}