import { TransformFilterType } from "@/type/screen.type";
import { cloneDeep, isObject } from "lodash-es";

/**
 * @description 映射
*/
export const mappingData = function (data: unknown = [], fields: Record<string, any>[] = []) {
    if (
        !(data instanceof Array) ||
        !(fields instanceof Array) ||
        fields.length === 0 ||
        data.length === 0
    ) {
        return data;
    }

    return data.map((item) => {
        if (item == null || Array.isArray(item) || typeof item !== 'object') {
            return item;
        }

        const obj: Record<string, unknown> = {};
        fields.forEach((d) => {
            if (d.value && item[d.value] !== undefined) {
                obj[d.name] = item[d.value];
            }
        });
        // 严格模式
        return obj;

        // 宽松模式 - 无效变量太多
        // return {
        //     ...item,
        //     ...obj,
        // };
    });
};


export function filterData({ filters, data, callbackValues }: {
    filters: TransformFilterType[];
    data: unknown;
    callbackValues: Record<string, unknown>
}) {
    if (!filters || filters.length === 0) {
        return data;
    }

    if (data == null) {
        return [];
    }
    let result = isObject(data) ? cloneDeep(data) : data;
    try {
        filters.forEach((d) => {
            const callbackArgs = d.callbackKeys
                ? d.callbackKeys.reduce<Record<string, unknown>>((all, item) => {
                    let callbackValue = callbackValues[item];
                    // 对回调值做深拷贝
                    if (isObject(callbackValue) && callbackValue !== null) {
                        callbackValue = cloneDeep(callbackValue);
                    }

                    all[item] = callbackValue;
                    return all;
                }, {})
                : {};
            const filterFunction = new Function('data', 'callbackArgs', d.content);
            result = filterFunction(result, callbackArgs);
        });
        return result;
    } catch (error: any) {
        console.error('过滤器执行时发生错误：', error);
        return {
            isError: true,
            msg: error.toString(),
            originData: data,
        };
    }
    return [];
}