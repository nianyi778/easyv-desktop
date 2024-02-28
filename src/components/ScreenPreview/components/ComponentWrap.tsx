import { callbackState, components } from '@/dataStore'
import { ComponentRels } from "@/type/screen.type";
import { memo } from "react";
import { useRecoilValue } from 'recoil';
import ComponentSize from './ComponentSize';

function ComponentWrap({ id, hideDefault, containerIndex, componentRel, containerItemData }: { id: number; hideDefault?: boolean; containerIndex?: number; componentRel?: ComponentRels; containerItemData?: unknown }) {
    const componentsById = useRecoilValue(components);
    const component = componentsById[id];

    if (!component) {
        return null;
    }

    return <ComponentSize hideDefault={hideDefault} id={id} containerIndex={containerIndex} componentRel={componentRel} containerItemData={containerItemData} />
}

export default memo(ComponentWrap)