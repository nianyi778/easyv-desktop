import { getScreenDimension, reduceConfig } from "@lidakai/utils";
import ScreenPreview from "./components";
import { useRecoilValue } from "recoil";
import { screens } from "@/dataStore";
import { ScreenEnumType } from "@/type/screen.type";
import { useGetScreen } from "@/pages/hooks";

export default function ScreenMain({ screenId, type, width, height }: { screenId: number; type?: ScreenEnumType, width: number; height: number }) {
    const screensById = useRecoilValue(screens);
    let screen = screensById[screenId];
    if (!screen) {
        if (screenId) {
            console.log('大屏没数据了', screenId);
            useGetScreen(screenId);
            // screenData && useAsyncScreen(screenData);
        }
        return null;
    }

    const { config, layers } = screen;
    let styles = {};
    if (type === ScreenEnumType.screen) {
        const { background, useBackground, backgroundColor } = getScreenDimension(config);
        const bgClass = useBackground ? {
            backgroundImage: `url(${background}) no-repeat center center`
        } : {
            backgroundColor: backgroundColor
        };
        styles = bgClass
    } else if (type === ScreenEnumType.panel || type === ScreenEnumType.ref) {
        const {
            background,
            backgroundColor,
            useBackground,
        } = reduceConfig(config);
        const bgClass = useBackground ? {
            backgroundImage: `url(${background}) no-repeat center center`
        } : {
            backgroundColor: backgroundColor
        };
        styles = bgClass
    }


    return <div id={`screen_${screenId}`} style={{
        ...styles,
        width,
        height
    }}>
        <ScreenPreview layers={layers} />
    </div>
}