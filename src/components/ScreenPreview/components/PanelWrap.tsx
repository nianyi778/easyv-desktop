import { useRecoilValue } from 'recoil';
import { panels } from '@/dataStore'
import { getId } from '@lidakai/utils';
import Panel from './Panel';

export default function PanelWrap({ id }: { id: string; }) {

    const panelsById = useRecoilValue(panels);
    const panel = panelsById[getId(id)];
    if (!panel) {
        return <div>panel</div>
    }
    const { config, states, type } = panel;
    const { width, height, left, top } = config;

    return <div id={id}
        className=" absolute"
        style={{
            width,
            height,
            left,
            top,
        }}>
        {
            states.concat().reverse().map(state => <Panel key={state} screenId={state} width={width} type={type} height={height} />)
        }
    </div>
}