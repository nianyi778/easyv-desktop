import { Spin } from 'antd';
export default function RouterSpin() {
    return <div className=' w-full h-full flex items-center justify-center'>
        <Spin tip='加载中...'></Spin>
    </div>
}