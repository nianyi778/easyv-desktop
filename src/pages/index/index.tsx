import './index.css'
import { getScreens } from '@/utils/screen';
import { getResourceFile } from '@/utils/file';
import { useCallback, useState } from 'react';
import { Image, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultScreenImg } from '@/constants/defaultConfig';
import { useRequest } from 'ahooks';
import Skeleton from './components/skeleton';
import { Button, Input, Space, Popconfirm, Result } from 'antd';
import { ExperimentOutlined, SearchOutlined } from '@ant-design/icons';
import ImportScreen from './components/importScreen';

function Index() {
    const { data, loading, refresh } = useRequest(() => getScreens())
    const [manage, setManage] = useState(false);
    const [checkeds, setCheckeds] = useState<number[]>([]);
    const onHide = () => {
        refresh();
    }

    const onAllSelect = () => {
        if (Array.isArray(data)) {
            setCheckeds(data.map(d => d.screenConfig.id))
        }
    }

    const onManage = () => {
        if (manage) {
            setCheckeds([]);
        }
        // 管理
        setManage(!manage);
    }

    const onBatchDeletion = () => {
        // 批量删除
        const { ipcRenderer } = window;
        ipcRenderer.invoke('screen-del', checkeds);
        ipcRenderer.on('screen-del-send', (_: any, args: boolean[]) => {
            message.success('删除成功');
            refresh();
            setCheckeds([]);
        });

    }

    return (
        <div className='p-[20px] h-full'>
            <div className='h-[60px]'>

                <div className='flex align-middle justify-end'>
                    {
                        manage ? <Space>
                            <Button type='default' onClick={onManage}>取消操作</Button>
                            <Button type='default' onClick={onAllSelect}>全选</Button>
                            <Popconfirm title="确认删除？" onConfirm={onBatchDeletion} placement="topRight" description={"谨慎操作，不可逆"}>
                                <Button type='primary' disabled={!checkeds.length} >批量删除</Button>
                            </Popconfirm>
                        </Space> : <Space>
                            <Input placeholder="搜索" prefix={<SearchOutlined />} />
                            <Button type='default' onClick={onManage}>管理</Button>
                            <ImportScreen onHide={onHide}>
                                <Button type='primary'> 导入</Button>
                            </ImportScreen>
                        </Space>
                    }

                </div>
            </div>
            <div className='h-[calc(100%-40px)] overflow-y-auto pb-[20px]'>
                <Item data={data} loading={loading} manage={manage} onHide={onHide} setCheckeds={setCheckeds} checkeds={checkeds} ></Item>
            </div>
        </div>
    )
}

export default Index;




function Item({ data, loading, manage, setCheckeds, checkeds, onHide }: { data?: any[]; loading: boolean; manage: boolean; setCheckeds: (x: any) => any; checkeds: number[]; onHide: () => void; }) {
    const navigate = useNavigate();

    const onLinkChange = useCallback((screenId: number) => {
        navigate(`/shareScreen/${screenId}`)
    }, []);

    const onChange = (checked: boolean, id: number) => {
        setCheckeds((checkeds: any[]) => !checked ? checkeds.filter(d => d !== id) : checkeds.concat(id))
    };

    if (loading) {
        return <div className="grid-cols-[repeat(auto-fill,minmax(258px,1fr))] grid gap-[24px] scroll-smooth">
            {
                Array(3).fill(1).map((_, i) => <Skeleton key={i} />)
            }
        </div>

    }
    if (Array.isArray(data) && !data.length) {
        return <div className=' w-full h-full '>
            <Result
                icon={<ExperimentOutlined />}
                title="本地无大屏数据，请导入后查看"
                extra={<ImportScreen onHide={onHide}>
                    <Button type='primary'> 大屏导入</Button>
                </ImportScreen>}
            ></Result>
        </div>;
    }

    if (!Array.isArray(data)) {
        return null;
    }

    return <div className="grid-cols-[repeat(auto-fill,minmax(258px,1fr))] grid gap-[24px] scroll-smooth">
        {
            data.map(screen => {
                const { id, name, thumb: screenThumb } = screen.screenConfig
                let thumb = getResourceFile(screenThumb)
                return <div key={id} onClick={() => !manage && onLinkChange(id)} className=" relative cursor-pointer p-[8px] screen group hover-screen">
                    <div className='h-[calc(100%-30px)] overflow-hidden rounded-md relative'>
                        <div className="content pb-[55.7%]  w-full h-full bg-cover bg-no-repeat bg-top h-[calc(100% - 44px)] ">
                            <div className=' left-0 right-0 bottom-0 absolute top-0 z-10'>
                                <Image width={'100%'} preview={false} placeholder={defaultScreenImg} fallback={defaultScreenImg} height={'100%'} src={thumb}></Image>
                            </div>
                        </div>
                    </div>
                    <div className='title text-[12px] overflow-hidden whitespace-nowrap overflow-ellipsis'>
                        {
                            manage ? <Checkbox checked={checkeds.includes(id)} onChange={(e) => onChange(e.target.checked, id)}> {name}</Checkbox> : name
                        }
                    </div>
                </div>
            })
        }
    </div>


}