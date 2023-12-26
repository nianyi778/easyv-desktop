import { getScreenDimension, reduceConfig } from "@lidakai/utils";
import ScreenPreview from "./components";
import { useRecoilValue } from "recoil";
import { screens } from "@/dataStore";
import { ScreenEnumType, TransformScreenType } from "@/type/screen.type";
import { useGetScreen } from "@/pages/hooks";
import { useEffect, useState } from "react";

export default function ScreenMain({ screenId, type, width, height }: { screenId: number; type?: ScreenEnumType, width: number; height: number }) {
    const screensById = useRecoilValue(screens);
    const getScreeData = useGetScreen();
    const [screen, setScreen] = useState<TransformScreenType | null>(null);

    useEffect(() => {
        const data = screensById[screenId];
        if (!data) {
            if (screenId && !data) {
                (async () => {
                    const result = await getScreeData(screenId);
                    if (result) {
                        const screen = result?.screens.find(d => d.id === screenId);
                        screen && setScreen(screen);
                    }
                })()
            }
        } else {
            setScreen(data);
        }
    }, [screenId, screensById])

    if (!screen) {
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