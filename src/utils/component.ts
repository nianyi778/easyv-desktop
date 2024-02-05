import { Layer } from "@/type/screen.type";

export function deepLayersComponents(layers: Layer[]): Layer[] {
    return layers.reduce<Layer[]>((all: Layer[], cur: Layer) => {
        const { components, ...rest } = cur;
        if (Array.isArray(components) && components.length) {
            return all.concat(rest).concat(deepLayersComponents(components));
        }
        return all.concat(rest);
    }, []);
};

