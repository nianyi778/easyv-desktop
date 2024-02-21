import { DataConfig, OtherDataType, TransformFilterType } from "@/type/screen.type";
import { getSource } from "@/utils";
import { filterData, mappingData } from "@/utils/filter";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";


export default function useDataGet({ dataConfig, filters }: { dataConfig?: { data: unknown; fields?: Record<string, unknown>[] | undefined; config?: OtherDataType; }; filters: TransformFilterType[] }) {
    const [data, setData] = useState<unknown>([]);

    useEffect(() => {
        if (dataConfig) {
            (async () => {
                let result = await getSource(dataConfig);

                const { fields } = dataConfig;
                if (Array.isArray(filters)) {
                    result = filterData({
                        data: result,
                        filters,
                        callbackValues: {}
                    })
                }
                if (fields) {
                    result = mappingData(result, fields)
                }
                setData((x: unknown) => isEqual(x, result) ? x : result)
            })()
        }

    }, [dataConfig])

    return data;
}