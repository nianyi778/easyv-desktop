
import { ScreenEnumType } from '@/type/screen.type';
import ScreenPreview from '../index';

export default function Panel({ screenId, type, width, height }: { type: 0 | 1; screenId: number; width: number; height: number }) {

    return <ScreenPreview screenId={screenId} type={type ? ScreenEnumType.ref : ScreenEnumType.panel} width={width} height={height} />
}