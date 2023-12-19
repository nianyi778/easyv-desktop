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

    const bgClass = useBackground ? `bg-[url(${background})]` : `bg-[${backgroundColor}]`;

    const cls = `w-[${width}px] h-[${height}px] relative ${bgClass}`;

    const mock = 'w-[1920px] h-[1080px] relative bg-[#232630]';
    return <div id="screen-preview" className={mock}>
        <ScreenPreview layers={screen.layers} />
    </div>
}