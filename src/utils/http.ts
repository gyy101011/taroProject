import Taro from '@tarojs/taro';
const baseURL = process.env.TARO_APP_API_BASE_URL
type Data<T> = {
    code: number
    msg: string
    data: T
}
export const http = <T>(options: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    header?: any;
}) => {
    //1.返画 Promise 对象
    return new Promise<Data<T>>((resolve, reject) => {
        Taro.request({
            ...options,
            success(res) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    if (res.data.code !== 0) {
                        Taro.showToast({
                            icon: 'error',
                            title: res.data.msg || '请求错误'
                        });
                    } else {

                        resolve(res.data as Data<T>);
                    }
                } else if (res.statusCode === 401) {
                    Taro.navigateTo({ url: '/pages/login/login' });
                    reject(res);
                } else {

                    Taro.showToast({
                        icon: 'none',
                        title: res.data.msg || '请求错误'
                    });
                    reject(res);
                }
            },
            fail(err) {
                Taro.showToast({
                    icon: 'none',
                    title: '网络错误，换个网络试试'
                });
                reject(err);
            }
        });
    });
};
const httpInterceptor = function (chain) {
    const requestParams = chain.requestParams;
    const { url } = requestParams;
    if (!url.startswith('http')) {
        requestParams.url = baseURL + url;
    }
    requestParams.header = {
        ...requestParams.header
    };
    const token = Taro.getStorageSync('token') || 'no-token';
    if (token) {
        requestParams.header.Authorization = token;
    }
    return chain.proceed(requestParams).then((res) => {
        console.log(`http <-- ${url} result:`, res);
        return res;
    });
};

Taro.addInterceptor(httpInterceptor);