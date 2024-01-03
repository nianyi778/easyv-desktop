import {
    CloseCircleOutlined
} from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { message } from 'antd';
import { useEffect, useState } from 'react';


export default function Backspace({ onBack }: { onBack: () => void }) {
    const [visible, setVisible] = useState(false);
    // https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useKeyPress/index.ts#L21
    useKeyPress('ctrl.z', () => {
        setVisible(true)
    });

    useKeyPress('ctrl.r', () => {
        window.location.reload();
    });

    useEffect(() => {
        let time: any;
        if (visible) {
            time = setTimeout(() => {
                setVisible(false);
            }, 2000);
        }

        return () => {
            time && clearTimeout(time);
        }
    }, [visible])

    return <div className={`fixed transition-all w-full h-[25px] text-center ${visible ? 'top-[10px]' : 'top-[-25px]'}`}>
        <CloseCircleOutlined className=' cursor-pointer text-[25px] hover:text-blue-600' onClick={onBack} />
    </div>
}