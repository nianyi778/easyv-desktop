import { TransformComponentType } from "./screen.type";



export interface ChildrenConfig {
    id: number;
    base: TransformComponentType['base'];
    configuration: TransformComponentType['config'];
    dataType: TransformComponentType['dataType'];
    dataConfig: unknown;
    autoUpdate: TransformComponentType['autoUpdate'];
    dataFrom: TransformComponentType['dataFrom'];
    actions: TransformComponentType['actions'];
    events: TransformComponentType['events']
}