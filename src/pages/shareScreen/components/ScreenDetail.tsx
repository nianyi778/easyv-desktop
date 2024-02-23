import { getScreenDimension } from '@easyv/admin-utils';
import ScreenPreview from '@/components/ScreenPreview';
import { useRecoilValue } from 'recoil';
import { screens } from '@/dataStore/screen';
import { calculateScaleAndPosition } from '@/utils/screen';
import { useSize } from 'ahooks'

export default function ScreenDetail({ screenId }: { screenId: number }) {

    const screensById = useRecoilValue(screens);
    const screen = screensById[screenId];
    const size = useSize(document.querySelector('body'));

    if (!screen) {
        return <span> {screenId} - 无大屏数据</span>
    }
    const { width, height, backgroundColor } = getScreenDimension(screen.config);

    if (backgroundColor) {
        document.body.style.backgroundColor = backgroundColor
    }

    const actualWidth = size?.width || window.innerWidth; // 当前网页的实际宽度
    const actualHeight = size?.height || window.innerHeight; // 当前网页的实际高度

    const targetWidth = width; // 配置的目标宽度
    const targetHeight = height; // 配置的目标高度

    const { scale, left, top } = calculateScaleAndPosition(actualWidth, actualHeight, targetWidth, targetHeight);

    return <div id="bigscreen-container"
        className={'absolute overflow-hidden origin-top-left bg-no-repeat'}
        style={{
            transform: `scale(${scale})`,
            left,
            top
        }}>
        <ScreenPreview screenId={screenId} width={width} height={height} />
    </div>
}