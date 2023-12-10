import {
    createHashRouter,
} from "react-router-dom";
import App from '@/App';
import { lazy } from "react";
const ShareScreen = lazy(() => import('@/pages/shareScreen'))
const Home = lazy(() => import('@/pages/index'))

export const routers = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "shareScreen/:screenId",
                element: <ShareScreen />,
            },
        ],
    },
]);
