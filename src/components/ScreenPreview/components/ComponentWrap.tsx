import Component from "./Component";
import { components, filters } from '@/dataStore'
import { TransformFilterType } from "@/type/screen.type";
import { useMemo } from "react";
import { useRecoilValue } from 'recoil';

export default function ComponentWrap({ id, hideDefault }: { id: number; hideDefault?: boolean }) {
    const componentsById = useRecoilValue(components);
    const filtersStore = useRecoilValue(filters);

    const component = componentsById[id];
    const comFilters = useMemo(() => {
        const { useFilter, filters } = component;
        if (useFilter) {
            const curFilters = filters.filter(f => f.enable).map(f => filtersStore.find(d => d.id === f.id)).filter(d => d);
            return curFilters as TransformFilterType[];
        }
        return undefined;
    }, [component, filtersStore]);

    const children = useMemo(() => {
        return Array.isArray(component.children) ? component.children.map(c => componentsById[c]) : undefined;
    }, [component, componentsById]);

    if (!component) {
        return null;
    }

    return <Component id={id} hideDefault={hideDefault} filters={comFilters} component={component} children={children} />
}