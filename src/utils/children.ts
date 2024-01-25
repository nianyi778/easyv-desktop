interface CustomInfo {
    children?: { id: number }[];
    id: number;
}

// 子组件排序
export function sortCustomInfo(children: number[] = [], customInfo: CustomInfo[] = []) {
    // sort
    if (Array.isArray(children) && !children.length) {
        return [];
    }

    let customChildren = children;
    if (Array.isArray(customInfo) && customInfo.length) {
        customChildren = customInfo.reduce<number[]>(
            (all, item) => {
                if (Array.isArray(item.children)) {
                    return all.concat(item.children.map(c => c.id))
                }
                return all.concat(item.id);
            },
            [],
        );
    }
    return Array.from(new Set(customChildren.concat(children))) as number[];
}