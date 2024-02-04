/// <reference types="vite/client" />


interface Window {
    define: any;
    join: (...args) => string;
    ipcRenderer: any;
    component: Record<string, unknown>;
    appConfig: {
        appDataPath: string;
        ASSETS_URL: string;
    }
}

