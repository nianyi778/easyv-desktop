
import { ScreenEnumType } from '@/type/screen.type';
import ScreenPreview from '../index';
import Animation from '@/components/Animation';
import { AnimateType } from '@/constants';

export default function Panel({ screenId, type, width, height, config }: {
    config: {
        visible: boolean,
        unmount: boolean,
        childrenWidth: number,
        animationDuration: number;
        animateType: AnimateType;
    }; type: 0 | 1; screenId: number; width: number; height: number
}) {

    return <Animation type={config.animateType} config={config} >
        <div className=' absolute left-0 top-0'>
            <ScreenPreview screenId={screenId} type={type ? ScreenEnumType.ref : ScreenEnumType.panel} width={width} height={height} />
        </div>
    </Animation>

}