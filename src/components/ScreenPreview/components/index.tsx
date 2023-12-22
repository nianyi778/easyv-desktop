import { Layer, TransformScreenType } from "@/type/screen.type";
import { isComponent, isContainer, isPanel, isRef, isGroup } from '@/utils/index';
import React from "react";
const GroupWrap = React.lazy(() => import('./GroupWrap'));
const ComponentWrap = React.lazy(() => import('./ComponentWrap'));
const PanelWrap = React.lazy(() => import('./PanelWrap'));

export default function ScreenPreview({ layers }: { layers: TransformScreenType['layers']; }) {
    if (!Array.isArray(layers)) {
        return null;
    }

    return layers.map(layer => {
        if (isComponent(layer.id as number)) {
            return <ComponentWrap key={layer.id} id={layer.id as number} />
        }
        if (isContainer(layer.id as string)) {

        }
        if (isPanel(layer.id as string) || isRef(layer.id as string)) {
            return <PanelWrap key={layer.id} id={layer.id as string} />

        }
        if (isGroup(layer.id as string)) {
            console.log('group')
            return <GroupWrap key={layer.id} id={layer.id as string} components={layer.components as Layer[]} />
        }
        return null;
    }).filter(d => d)
}