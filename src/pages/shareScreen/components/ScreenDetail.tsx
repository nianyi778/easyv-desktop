import { getScreenDimension } from '@lidakai/utils';
import ScreenPreview from '@/components/ScreenPreview';
import { useRecoilValue } from 'recoil';
import { screens } from '@/dataStore/screen';

export default function ScreenDetail({ screenId }: { screenId: number }) {

    // const screen = screenData.screens.find(d => d.id === screenId);
    const screensById = useRecoilValue(screens);
    const screen = screensById[screenId];

    if (!screen) {
        return <span> {screenId} - 无大屏数据</span>
    }
    console.log(screen, 'screen');

    const { width, height, background, useBackground, backgroundColor } = getScreenDimension(screen.config);

    return <div id="screen-preview" className={` w-[${width}px] h-[${height}px] relative`}>
        <ScreenPreview />
    </div>
}