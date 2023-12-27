import { Layer } from '@/type/screen.type';
import Home from './index';

export default function Group({ width, height, layers }: { width: number, height: number; layers: Layer[] }) {

    return <div style={{
        width,
        height,
    }}>
        <Home layers={layers}></Home>
    </div>
}