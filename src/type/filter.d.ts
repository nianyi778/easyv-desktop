enum FilterType {
    screen = 'screen'
}

export interface Filter {
    callbackKeys: string;
    content: string;
    createAt: Date<string>;
    deleted: boolean;
    filterId: string;
    id: number;
    name: string;
    parentId: number;
    type: FilterType;
    updateAt: Date<string>;
}

export interface ComponentFilter {
    id: number;
    enable: boolean;
}