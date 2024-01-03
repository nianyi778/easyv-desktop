export interface ComContainerReduceConfig {
    style: {
        background: string;
        useBackground: boolean;
        backgroundColor: string;
    };
    autoLayout: AutoLayoutConfigProps;
    scrollSettings: ScrollSettingsConfigProps,
    chart: {
        dimension: {
            chartDimension: {
                width: number;
                height: number;
            };
            chartPosition: {
                left: number;
                top: number;
            }
        }
    }
}



export interface AutoLayoutConfigProps {
    layoutType: 'line' | 'column';
    lineNumber: number;
    columnNumber: number;
    spacing: {
        lineSize: number;
        columnSize: number;
    };
}

export interface ScrollSettingsConfigProps {
    animationTypes: 'single' | 'all';
    beyondScroll: 'auto' | 'manual';
    enableScrolling: boolean;
    interval: number;
    backgroundFixed: boolean;
    runningModel: 'continuous' | 'startAnew';
}
