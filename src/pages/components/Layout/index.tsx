import { ReactNode } from "react";
import './index.css';

export default function Layout({ children }: { children: ReactNode }) {

    return <div className="app">
        {children}
    </div>
}