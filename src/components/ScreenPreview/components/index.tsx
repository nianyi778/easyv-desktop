import { Layer, TransformScreenType } from "@/type/screen.type";
import { isComponent, isContainer, isPanel, isRef, isGroup } from '@/utils/index';
import React, { memo } from "react";
const GroupWrap = React.lazy(() => import('./GroupWrap'));
const ComponentWrap = React.lazy(() => import('./ComponentWrap'));
const PanelWrap = React.lazy(() => import('./PanelWrap'));
const ContainerWrap = React.lazy(() => import('./ContainerWrap'));

function ScreenPreview({ layers }: { layers: TransformScreenType['layers']; }) {

    if (!Array.isArray(layers)) {
        return null;
    }
    return layers.concat()
        .reverse().filter(l => l.show).map(layer => {
            if (isComponent(layer.id as number)) {
                return <ComponentWrap key={layer.id} id={layer.id as number} />
            }
            if (isContainer(layer.id as string)) {
                return <ContainerWrap key={layer.id} id={layer.id as string}></ContainerWrap>
            }
            if (isPanel(layer.id as string) || isRef(layer.id as string)) {
                return <PanelWrap key={layer.id} id={layer.id as string} />

            }
            if (isGroup(layer.id as string)) {
                return <GroupWrap key={layer.id} config={{
                    opacity: layer.opacity || 1
                }} id={layer.id as string} components={layer.components as Layer[]} />
            }
            return null;
        }).filter(d => d)
}


export default memo(ScreenPreview)