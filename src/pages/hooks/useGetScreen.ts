import { getScreenData, cleanLargeScreenData } from "@/utils";


export function useGetScreen(id: number | string) {

    if (id) {
        const data = getScreenData(id);
        if (data) {
            const result = cleanLargeScreenData(data);
            return result;
        }
    }
    return null;
}