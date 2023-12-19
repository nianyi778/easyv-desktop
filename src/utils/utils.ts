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
    return /^group_[0-9]+/.test(id)
}