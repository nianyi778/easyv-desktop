import { useEffect, useState } from 'react';
import { define } from '@/utils/define';
import { TransformComponentType } from '@/type/screen.type';
import LoadingSpinner from '@/components/LoadingAnimation';
import ComponentEmpty from '@/components/ComponentEmpty';


interface EasyVComponentType {
    config: unknown[];
    name: string;
    id: number; base: TransformComponentType['base']; spaceId?: number;
    height: number; width: number; left: number; top: number;
    uniqueTag: string;
    data: unknown[]
}

export default function EasyVComponent(
    { id, base, spaceId, uniqueTag, height, name, config, width, left, top, data }: EasyVComponentType) {
    const [loadedScript, setLoadedScript] = useState(false);
    const [component, setComponent] = useState<any>(null);

    useEffect(() => {
        const { version, module_name } = base;
        if (version && module_name) {
            // 加载组件js
            const random = Math.random();
            define(
                `com_${id}_${random}`,
                [`${module_name}@${version}`],
                (com: any) => {
                    if (!window.component) {
                        window.component = {};
                    }
                    window.component[`${module_name}@${version}`] = com;
                    setComponent((_: any) => com);
                    setLoadedScript(true)
                },
                spaceId,
            );
        }

    }, [base, spaceId]);

    if (!loadedScript) {
        return (
            <LoadingSpinner
                style={{
                    left,
                    top,
                    width,
                    height,
                    position: 'absolute',
                }}
            />
        );
    }

    if (!component) {
        return <ComponentEmpty
            text={`${id}-${name}(加载失败)`}
            style={{
                width,
                height,
                lineHeight: height + 'px',
            }} />
    }

    const Com = component as any;

    return <div id={uniqueTag}
        style={{
            position: 'absolute',
            pointerEvents: 'auto',
        }}>
        <Com id={id} data={data} configuration={config} actions={[]}
            events={[]} iState={{
                show: true
            }} />
    </div>
}