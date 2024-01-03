

interface ComponentsConfig extends ContainerComponentsSize {
    right: number;
    bottom: number;
}

interface EffectiveValueProps {
    componentsConfig: ComponentsConfig,
    type: "min" | "max",
    value: string
}

interface ContainerComponentsSize {
    left: number;
    width: number;
    top: number;
    height: number;
}


function getEffectiveValue({ componentsConfig, type, value }: EffectiveValueProps) {
    if (!Array.isArray(componentsConfig) || !componentsConfig.length) {
        return 0;
    }
    const firstValue = componentsConfig[0][value];
    // 获取有效容器宽度
    if (type === 'min') {
        return componentsConfig.reduce((all, cur) => {
            if (cur[value] < all) {
                return cur[value];
            }
            return all;
        }, firstValue)
    } if (type === 'max') {
        return componentsConfig.reduce((all, cur) => {
            if (cur[value] > all) {
                return cur[value];
            }
            return all;
        }, firstValue)
    }

    return 0;
}

export function getTemplateSize(componentsConfig: ContainerComponentsSize[]) {
    const newComponentsConfig = componentsConfig.map(c => ({
        ...c,
        right: c.left + c.width,
        bottom: c.top + c.height
    })) as unknown as ComponentsConfig;

    const minLeft = getEffectiveValue({ componentsConfig: newComponentsConfig, type: 'min', value: "left" });
    const maxRight = getEffectiveValue({ componentsConfig: newComponentsConfig, type: 'max', value: "right" });
    const minTop = getEffectiveValue({ componentsConfig: newComponentsConfig, type: 'min', value: "top" });
    const maxBottom = getEffectiveValue({ componentsConfig: newComponentsConfig, type: 'max', value: "bottom" });
    return {
        width: maxRight - minLeft,
        height: maxBottom - minTop,
        left: minLeft,
        top: minTop
    }
}