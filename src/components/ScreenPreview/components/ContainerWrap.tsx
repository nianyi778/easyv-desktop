import Container from "./Container"
import { useRecoilValue } from 'recoil';
import { comContainers } from '@/dataStore'
import { getId, getComponentDimension, reduceConfig } from "@lidakai/utils";
import { ComContainerReduceConfig } from "@/type/com-container.type";

export default function ContainerWrap({ id }: { id: string }) {
    const containerById = useRecoilValue(comContainers);
    const container = containerById[getId(id)];
    if (!container) {
        return null;
    }
    const { width, height, left, top } = getComponentDimension(container.config);
    const config = reduceConfig(container.config) as ComContainerReduceConfig;

    // console.log(config, 'config');

    return <div
        id={id}
        className=" absolute" style={{
            width,
            height,
            left,
            top
        }}>
        <Container />
    </div>
}