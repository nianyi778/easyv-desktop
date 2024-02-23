import { components } from '@/dataStore/component';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { updateArrayWithObject } from '@easyv/admin-utils';

export function useUpdateConfig() {
    const [componentById, setComponentById] = useRecoilState(components);

    const updateConfig = useCallback((newConfig: Record<string, unknown>, targetComponentId: number) => {
        const component = componentById[targetComponentId];
        if (component) {
            const newComponent = {
                ...component,
                config: updateArrayWithObject(component.config, newConfig)
            };
            setComponentById(x => ({ ...x, [targetComponentId]: newComponent }))
        }
    }, [componentById, setComponentById])

    return updateConfig;
}