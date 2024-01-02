export interface ComContainerReduceConfig {
    style: {
        background: string;
        useBackground: boolean;
        backgroundColor: string;
    };
    autoLayout: {
        columnNumber: number;
        layoutType: 'column' | 'line';
        lineNumber: number;
        spacing: {
            lineSize: number;
            columnSize: number;
        }
    };
    scrollSettings: {
        animationTypes: "single";
        backgroundFixed: boolean;
        beyondScroll: "auto";
        enableScrolling: boolean;
        interval: number;
    },
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