import { useRecoilValue } from 'recoil';
import { panels } from '@/dataStore'
import { getId } from '@lidakai/utils';
import PanelAnimation from './PanelAnimation';

export default function PanelWrap({ id }: { id: string; }) {

    const panelsById = useRecoilValue(panels);
    const panel = panelsById[getId(id)];

    if (!panel) {
        return <div>panel</div>
    }
    const { config, states, type } = panel;
    const { width, height, left, top } = config;


    return <div id={id}
        className=" absolute overflow-hidden"
        style={{
            width,
            height,
            left,
            top,
        }}>

        <PanelAnimation states={states} id={id} config={config} type={type} />

    </div>
}