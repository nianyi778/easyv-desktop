import { useParams, useNavigate } from 'react-router-dom'
import { useGetScreen } from '@/pages/hooks';
import PageLoading from './components/PageLoading';
import ScreenDetail from './components/ScreenDetail';
import Backspace from '@/components/Backspace';

export default function ShareScreen() {
    const { screenId } = useParams();
    const screenData = useGetScreen(screenId as string);
    const navigate = useNavigate();

    if (!screenId) {
        return <span>数据异常，请回退</span>
    }
    if (!screenData) {
        return <PageLoading />
    }

    return <>
        <Backspace onBack={() => {
            // 返回
            navigate('/')
        }} />
        <ScreenDetail screenId={+screenId} />
    </>
}