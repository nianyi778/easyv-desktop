export function isContainer(id: string) {
    return /^container_[0-9]+/.test(id);
}


export function isComponent(id: number) {
    return /^[0-9]+/.test(id + '');
}

export function isPanel(id: string) {
    return /^panel_[0-9]+/.test(id)
}


export function isRef(id: string) {
    return /^ref_[0-9]+/.test(id)
}

export function isGroup(id: string) {
    return /^group_\w+/.test(id)
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