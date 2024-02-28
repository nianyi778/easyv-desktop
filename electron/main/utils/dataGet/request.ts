import axios, { AxiosRequestConfig } from 'axios';

const customAxios = async (config: AxiosRequestConfig) => {
    // 默认配置选项
    const defaultConfig = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const { headers: NewHeaders = {}, ...rest } = config;
    // 合并配置选项
    const mergedConfig = {
        ...defaultConfig, ...rest, headers: {
            ...defaultConfig.headers,
            ...NewHeaders
        }
    };
    try {
        // 发起请求
        const response = await axios(mergedConfig);
        return response;
    } catch (error) {
        throw error;
    }
};

export default customAxios;