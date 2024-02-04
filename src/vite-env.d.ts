/// <reference types="vite/client" />


interface Window {
    define: any;
    _: any;
    ipcRenderer: any;
    component: Record<string, unknown>;
    appConfig: {
        appDataPath: string;
        ASSETS_URL: string;
    }
}

