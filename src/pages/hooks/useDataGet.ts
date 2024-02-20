import { DataConfig, TransformFilterType } from "@/type/screen.type";
import { getSource } from "@/utils";
import { filterData, mappingData } from "@/utils/filter";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";


export default function useDataGet({ dataConfig, filters }: { dataConfig: any; filters: TransformFilterType[] }) {
    const [data, setData] = useState<unknown>(null);


    useEffect(() => {
        (async () => {
            let result = await getSource(dataConfig);

            const { fields, componentRels } = dataConfig;
            if (Array.isArray(filters)) {
                result = filterData({
                    data: result,
                    filters,
                    callbackValues: {}
                })
            }
            if (componentRels) {
                // 组件容器
            } else if (fields) {
                result = mappingData(result, fields)
            }
            setData((x: unknown) => isEqual(x, result) ? x : result)
        })()
    }, [dataConfig])

    return data;
}