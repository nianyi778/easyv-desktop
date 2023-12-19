import {
    createHashRouter,
} from "react-router-dom";
import App from '@/App';
import { lazy } from "react";
import Layout from "@/components/Layout";
const ShareScreen = lazy(() => import('@/pages/shareScreen'))
const Home = lazy(() => import('@/pages/index'))

export const routers = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Layout><Home /></Layout>,
            },
            {
                path: "shareScreen/:screenId",
                element: <ShareScreen />,
            },
        ],
    },
]);
