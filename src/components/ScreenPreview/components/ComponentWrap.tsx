import Component from "./Component";
import { components, filters } from '@/dataStore'
import { ComponentRels, DataType, TransformFilterType } from "@/type/screen.type";
import { get, isObject } from "lodash-es";
import { useMemo } from "react";
import { useRecoilValue } from 'recoil';

export default function ComponentWrap({ id, hideDefault, containerIndex, componentRel, containerItemData }: { id: number; hideDefault?: boolean; containerIndex?: number; componentRel?: ComponentRels; containerItemData?: unknown }) {
    const componentsById = useRecoilValue(components);
    const filtersStore = useRecoilValue(filters);

    const component = componentsById[id];
    const comFilters = useMemo(() => {
        if (component) {
            const { useFilter, filters } = component;
            if (useFilter) {
                const curFilters = filters.filter(f => f.enable).map(f => filtersStore.find(d => d.id === f.id)).filter(d => d);
                return curFilters as TransformFilterType[];
            }
        }

        return undefined;
    }, [component, filtersStore]);

    const children = useMemo(() => {
        if (component) {
            return Array.isArray(component.children) ? component.children.map(c => componentsById[c]) : undefined
        }
        return undefined;
    }, [component, componentsById]);

    const newContainerItemData = useMemo(() => {
        if (component.dataType === DataType.FROM_CONTAINER && componentRel && isObject(containerItemData)) {
            return get(containerItemData as Record<string, unknown>, componentRel.tag);
        }
        return undefined;
    }, []);


    if (!component) {
        return null;
    }

    return <Component id={id} hideDefault={hideDefault} containerItemData={newContainerItemData} containerIndex={containerIndex} filters={comFilters} component={component} children={children} />
}