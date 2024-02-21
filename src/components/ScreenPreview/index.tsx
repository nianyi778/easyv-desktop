import { getScreenDimension, reduceConfig } from "@lidakai/utils";
import ScreenPreview from "./components";
import { useRecoilValue } from "recoil";
import { screens } from "@/dataStore";
import { ComponentRels, ScreenEnumType, TransformScreenType } from "@/type/screen.type";
import { useGetScreen } from "@/pages/hooks";
import { useEffect, useState } from "react";
import { isNumber } from "lodash-es";
// import { queueWorker, StartState } from '@/utils/events';

export default function ScreenMain(
    { screenId, type = ScreenEnumType.screen, componentRels, width, height, index, containerItemData }:
        {
            containerItemData?: unknown;
            screenId: number; type?: ScreenEnumType, width: number; height: number; index?: number; componentRels?: ComponentRels[]
        }
) {
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


        // setTimeout(() => {
        //     queueWorker.updateEventStart(StartState.start)
        // }, 5000);



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
    } else if (type === ScreenEnumType.container) {
        // 不处理
    }

    const id = isNumber(index) ? `${type}_${screenId}_${index}` : `${type}_${screenId}`;

    return <div id={id} className="pointer-events-none" style={{
        ...styles,
        width,
        height
    }}>
        <ScreenPreview layers={layers} componentRels={componentRels} containerItemData={containerItemData} containerIndex={index} />
    </div>
}


