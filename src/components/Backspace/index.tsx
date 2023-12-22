import {
    LeftCircleOutlined
} from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { useEffect, useState } from 'react';


export default function Backspace({ onBack }: { onBack: () => void }) {
    const [visible, setVisible] = useState(false);
    // https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useKeyPress/index.ts#L21
    useKeyPress('esc', () => {
        setVisible(true)
    },);

    useEffect(() => {
        let time: any;
        if (visible) {
            time = setTimeout(() => {
                setVisible(false);
            }, 1000);
        }

        return () => {
            time && clearTimeout(time);
        }
    }, [visible])

    return <div className={`fixed transition-all w-full h-[25px] text-center ${visible ? 'top-0' : 'top-[-25px]'}`}>
        <LeftCircleOutlined className=' cursor-pointer hover:text-blue-600' onClick={onBack} />
    </div>
}