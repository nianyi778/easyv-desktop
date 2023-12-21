/// <reference types="vite/client" />


interface Window {
    define: any;
    component: Record<string, unknown>;
    appConfig: {
        appDataPath: string;
    }
}

