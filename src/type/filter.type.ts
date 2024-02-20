enum FilterType {
    screen = 'screen'
}

export interface Filter {
    callbackKeys: string;
    content: string;
    createAt: string;
    deleted: boolean;
    filterId: string;
    id: number;
    name: string;
    parentId: number;
    type: FilterType;
    updateAt: string;
}

export interface ComponentFilter {
    id: number;
    filterId?: number;
    enable: boolean;
}