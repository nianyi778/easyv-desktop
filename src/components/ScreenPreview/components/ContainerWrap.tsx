import Container from "./Container"
import { useRecoilValue } from 'recoil';
import { comContainers } from '@/dataStore'
import { getId, getComponentDimension, reduceConfig } from "@lidakai/utils";
import { ComContainerReduceConfig } from "@/type/com-container.type";
import { useFileToBase64 } from '@/pages/hooks';

export default function ContainerWrap({ id }: { id: string }) {
    const containerById = useRecoilValue(comContainers);
    const container = containerById[getId(id)];
    const convertFileToBase64 = useFileToBase64();

    if (!container) {
        return null;
    }
    const { width, height, left, top } = getComponentDimension(container.config);
    const config = reduceConfig(container.config) as ComContainerReduceConfig;

    console.log(config, 'config');
    const { style } = config;
    const {
        useBackground,
        background,
        backgroundColor
    } = style;

    const styles = useBackground ? {
        'backgroundImage': `url(${background})`,
        "backgroundPosition": "center center",
        "backgroundRepeat": 'no-repeat',
        "backgroundSize": "cover"
    } : {
        backgroundColor
    }

    return <div
        id={id}
        className=" absolute overflow-hidden"
        style={{
            width,
            height,
            left,
            top,
            ...styles
        }}>
        <Container />
    </div>
}