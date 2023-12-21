import { useEffect, useState } from 'react';
import { define } from '@/utils/define';
import { TransformComponentType } from '@/type/screen';
import LoadingSpinner from '@/components/LoadingAnimation';
import ComponentEmpty from '@/components/ComponentEmpty';

export default function EasyVComponent(
    { id, base, spaceId, uniqueTag, height, config, width, left, top }: {
        config: unknown[];
        id: number; base: TransformComponentType['base']; spaceId?: number;
        height: number; width: number; left: number; top: number;
        uniqueTag: string;
    }) {
    const [loadedScript, setLoadedScript] = useState(false);
    const [component, setComponent] = useState<any>();

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
                    setComponent(com);
                    setLoadedScript(true);
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
        return <ComponentEmpty />
    }

    const Com = component;

    return <div id={uniqueTag}
        style={{
            position: 'absolute',
            pointerEvents: 'auto',
        }}>
        {
            component ? <Com id={id} data={[]} configuration={config} actions={[]}
                events={[]} iState={{
                    show: true
                }} /> : null
        }
    </div>
}