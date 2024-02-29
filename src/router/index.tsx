import {
    createHashRouter,
} from "react-router-dom";
import App from '@/App';
import { lazy } from "react";
import Layout from "@/components/Layout";
const ShareScreen = lazy(() => import('@/pages/shareScreen'))
const Home = lazy(() => import('@/pages/index'))
const Settings = lazy(() => import('@/pages/settings/index'))
import ErrorBoundary from './ErrorBoundary';
import SuspenseRouter from "./SuspenseRouter";

export const routers = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <SuspenseRouter><Layout><Home /></Layout></SuspenseRouter>,
                errorElement: <ErrorBoundary></ErrorBoundary>
            },
            {
                path: "shareScreen/:screenId",
                element: <SuspenseRouter><ShareScreen /></SuspenseRouter>,
                errorElement: <ErrorBoundary></ErrorBoundary>
            },
            {
                path: "settings",
                element: <SuspenseRouter><Layout><Settings /></Layout></SuspenseRouter>,
                errorElement: <ErrorBoundary></ErrorBoundary>
            },
        ],
    },
]);
