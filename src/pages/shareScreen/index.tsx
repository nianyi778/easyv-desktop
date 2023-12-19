import { useParams } from 'react-router-dom'
import { useGetScreen } from '@/pages/hooks';
import PageLoading from './components/PageLoading';
import ScreenDetail from './components/ScreenDetail';
import { useSetRecoilState } from 'recoil';
import { screens, filter, panel, container, comContainer, components } from '@/dataStore';
import { arrayToObj } from '@lidakai/utils'
import { useEffect } from 'react';

export default function ShareScreen() {
    const { screenId } = useParams();
    const screenData = screenId && useGetScreen(screenId);
    const setScreensById = useSetRecoilState(screens);
    const setFilters = useSetRecoilState(filter);
    const setPanelsById = useSetRecoilState(panel);
    const setContainersById = useSetRecoilState(container);
    const setComContainersById = useSetRecoilState(comContainer);
    const setComponentsById = useSetRecoilState(components);


    useEffect(() => {
        if (screenData) {
            const { filters = [], screens = [], panel = [], containers = [], componentContainers = [], components } = screenData;
            setFilters(filters);
            setScreensById(arrayToObj(screens));
            setPanelsById(arrayToObj(panel));
            setContainersById(arrayToObj(containers));
            setComContainersById(arrayToObj(componentContainers));
            setComponentsById(arrayToObj(components));
        }
    }, [screenData])

    if (!screenId) {
        return <span>数据异常，请回退</span>
    }
    if (!screenData) {
        return <PageLoading />
    }

    return <ScreenDetail screenId={+screenId} />
}