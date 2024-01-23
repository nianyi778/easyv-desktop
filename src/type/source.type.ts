import { DataTypeNum } from "./screen.type";

export interface CsvConfig {
    filepath: string;
    encode: 'auto'
}

export interface ApiConfig {
    baseURL: string;
}

export interface TransformSource {
    config: ApiConfig | CsvConfig;
    dataId: string;
    deleted?: boolean;
    description?: string;
    name: string;
    type: DataTypeNum
}