import { ReactNode, CSSProperties } from 'react';
import './index.css';

function LoadingSpinner({ children = null, style = {} }: { children?: ReactNode; style?: CSSProperties }) {
  return <div className={'loading-spinner'} style={style} >{children}</div>;
}

export default LoadingSpinner;