import { useRecoilValue } from 'recoil';
import { panels } from '@/dataStore'
import { getId } from '@easyv/admin-utils';
import PanelAnimation from './PanelAnimation';

export default function PanelWrap({ id }: { id: string; }) {

    const panelsById = useRecoilValue(panels);
    const panel = panelsById[getId(id)];

    if (!panel) {
        return null;
    }
    const { config, states, type } = panel;

    return <PanelAnimation states={states} id={id} config={config} type={type} />
}