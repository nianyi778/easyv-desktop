
import { ScreenEnumType } from '@/type/screen.type';
import ScreenPreview from '../index';

export default function Panel({ screenId, type, width, height }: {
    type: 0 | 1; screenId: number; width: number; height: number
}) {

    return <div className=' absolute left-0 top-0'>
        <ScreenPreview screenId={screenId} type={type ? ScreenEnumType.ref : ScreenEnumType.panel} width={width} height={height} />
    </div>


}