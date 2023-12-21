import { getScreenDimension } from '@lidakai/utils';
import ScreenPreview from '@/components/ScreenPreview';
import { useRecoilValue } from 'recoil';
import { screens } from '@/dataStore/screen';

export default function ScreenDetail({ screenId }: { screenId: number }) {

    const screensById = useRecoilValue(screens);
    const screen = screensById[screenId];

    if (!screen) {
        return <span> {screenId} - 无大屏数据</span>
    }
    const { width, height, background, useBackground, backgroundColor } = getScreenDimension(screen.config);

    const bgClass = useBackground ? {
        backgroundImage: `url(${background}) no-repeat center center`
    } : {
        backgroundColor: backgroundColor
    };
    return <div id="screen-preview" className={'relative'} style={{
        width,
        height,
        ...bgClass
    }}>
        <ScreenPreview layers={screen.layers} />
    </div>
}