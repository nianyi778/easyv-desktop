import { useParams } from 'react-router-dom'
import { useGetScreen } from '@/pages/hooks';
import PageLoading from './components/PageLoading';
import ScreenDetail from './components/ScreenDetail';

export default function ShareScreen() {
    const { screenId } = useParams();
    const screenData = screenId && useGetScreen(screenId);
    if (!screenId) {
        return <span>数据异常，请回退</span>
    }
    if (!screenData) {
        return <PageLoading />
    }

    return <ScreenDetail />
}