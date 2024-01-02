import { CSSProperties } from 'react';
import './index.css';

function ComponentEmpty({ text = '加载失败', style = {} }: { text?: string; style?: CSSProperties }) {
  return <div className={'component-empty'} style={style} >{text}</div>;
}

export default ComponentEmpty;