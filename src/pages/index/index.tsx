import './index.css'
import Header from './components/header';
import { getScreens } from '@/utils/screen';
import { getResourceFile } from '@/utils/file';
import { useCallback } from 'react';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultScreenImg } from '@/constants/defaultConfig';
import { useRequest } from 'ahooks';
import Skeleton from './components/skeleton';

function Index() {
    const { data, loading, refresh } = useRequest(() => getScreens())

    const onHide = function () {
        refresh();
    }

    return (
        <div className='p-[20px] h-full'>
            <div className='h-[60px]'>
                <Header onHide={onHide} />
            </div>
            <div className='h-[calc(100%-40px)] overflow-y-auto pb-[20px]'>
                <div className="grid-cols-[repeat(auto-fill,minmax(258px,1fr))] grid gap-[24px] scroll-smooth">
                    <Item data={data} loading={loading}></Item>
                </div>
            </div>
        </div>
    )
}

export default Index;




function Item({ data, loading }: { data?: any[]; loading: boolean }) {
    const navigate = useNavigate();

    const onChange = useCallback((screenId: number) => {
        navigate(`/shareScreen/${screenId}`)
    }, []);


    if (loading) {
        return Array(3).fill(1).map((_, i) => <Skeleton key={i} />)
    }

    if (!Array.isArray(data)) {
        return null;
    }


    return data.map(screen => {
        const { id, name, thumb: screenThumb } = screen.screenConfig
        let thumb = getResourceFile(screenThumb)
        return <div key={id} onClick={() => onChange(id)} className=" relative cursor-pointer p-[8px] screen group hover-screen">
            <div className='h-[calc(100%-30px)] overflow-hidden rounded-md relative'>
                <div className="content pb-[55.7%]  w-full h-full bg-cover bg-no-repeat bg-top h-[calc(100% - 44px)] ">
                    <div className=' left-0 right-0 bottom-0 absolute top-0 z-10'>
                        <Image width={'100%'} preview={false} placeholder={defaultScreenImg} fallback={defaultScreenImg} height={'100%'} src={thumb}></Image>
                    </div>
                </div>
            </div>
            <div className='title text-[12px]'>
                {name}
            </div>
        </div>
    })

}