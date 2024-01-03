import { useParams, useNavigate } from 'react-router-dom'
import { useGetScreen } from '@/pages/hooks';
import PageLoading from './components/PageLoading';
import ScreenDetail from './components/ScreenDetail';
import Backspace from '@/components/Backspace';
import { useEffect, useState } from 'react';
import { ScreenPreviewType } from '@/type/screen.type';

export default function ShareScreen() {
    const { screenId } = useParams();
    const screenData = useGetScreen();
    const navigate = useNavigate();
    const [screen, setScreen] = useState<ScreenPreviewType | null>(null);

    useEffect(() => {
        (async () => {
            const data = await screenData(screenId as string);
            setTimeout(() => {
                data && setScreen(data);
            }, 1000);
        })()
    }, [])

    if (!screenId) {
        return <span>数据异常，请回退</span>
    }
    if (!screen) {
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