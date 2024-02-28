import { useRecoilValue } from 'recoil';
import { comContainers, screens, components, } from '@/dataStore'
import { getId } from "@easyv/admin-utils";
import ContainerSize from './ContainerSize';

export default function ContainerWrap({ id }: { id: string }) {
    const containerById = useRecoilValue(comContainers);
    const screensById = useRecoilValue(screens);
    const componentsById = useRecoilValue(components);
    const container = containerById[getId(id)];


    if (!container) {
        return null;
    }
    const containerScreen = screensById[container.subScreenId];

    if (!containerScreen) {
        //  找不到子屏也别浪费我cpu了。早点return
        return null;
    }
    const containerComponents = Array.isArray(containerScreen.components) ? containerScreen.components.map(c => componentsById[c]).filter(d => d) : [];

    if (!containerComponents.length) {
        // 子屏没组件也一样，没啥意义，为社会主义四个现代化做贡献吧。
        return null;
    }


    return <ContainerSize id={id} containerComponents={containerComponents} container={container} />
}

