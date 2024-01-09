
export function isPanel(id: string): boolean {
    return /^panel_/.test(id) || /^\$panel\((panel_[0-9]+)\)/.test(id);
}

// 组件容器
export function isContainerChildren(id: string): boolean {
    return /^\$container_[0-9]+\([container|component|group].+\)/.test(id);
}

export function isRef(id: string) {
    return /^ref_[0-9]+/.test(id)
}

export function isContainer(id: string): boolean {
    return /^container_/.test(id) || /^\$container\(container_[0-9]+\)/.test(id);
}

export function isGroup(id: string): boolean {
    return /^group_/.test(id) || /^\$group\((group_\w+)\)/.test(id);
}

export function isState(id: string): boolean {
    return /^state_/.test(id) || /^\$state\(([0-9]+)\)/.test(id);
}

export function isScreen(id: string): boolean {
    return /^screen_/.test(id) || /^\$screen\(([0-9]+)\)/.test(id);
}

export function isComponent(id: number | string): boolean {
    return typeof id === 'number' || /^\$component\(([0-9]+)\)/.test(id);
}

export function isRefScreen(id: string): boolean {
    return /^ref_/.test(id) || /^\$panel\((ref_[0-9]+)\)/.test(id);
}



export function isJsonString(str: string) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 *
 * @param callback 回调
 * @param interval 定时时间
 * @returns boolean s是否在v上
 * @description requestAnimationFrame 版本的setInterval
 */
export function setIntervalRAF(callback: () => void, interval: number) {
    let requestId: number;
    let start = performance.now();
    let elapsed = 0;

    function tick(timestamp: number) {
        elapsed = timestamp - start;

        if (elapsed >= interval) {
            callback();
            start = timestamp;
        }

        requestId = requestAnimationFrame(tick);
    }

    requestId = requestAnimationFrame(tick);

    function clearIntervalRAF() {
        cancelAnimationFrame(requestId);
    }

    return clearIntervalRAF;
}