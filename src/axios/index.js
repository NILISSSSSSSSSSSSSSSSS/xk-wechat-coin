/**
 * Created by qiushaoyu on 2017/12/6.
 */
// import axios from 'axios'
import config from './config'
import {assembleParams} from '../util/publicMehotds'
import service from '../service'

const http = {
    /**
     * axios Post请求
     * @param service  服务器API
     * @param params  对象参数
     * @param isEncrypt  data是否加密
     * @param timeout  请求超时时间
     * @returns {Promise}
     * @constructor
     */
    post(service, params, isEncrypt, timeout) {
        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt);
            if (timeout) {
                config.timeout = timeout;
            }
            config.params = "";
            axios.post(service, params, config)
                .then(res => {
                    //请求成功回调
                    if (res.data.code === 200) {
                        resolve(res.data.body);
                    }//服务器错误
                    else if (res.data.code === 409) {
                        //返回为空
                        resolve("");
                    }
                    else if (res.data.code === 500) {
                        reject(res.data.message ? res.data : {code: 500, message: "服务器异常，错误码：500"});
                    }else if(res.data.code === 1014){
                        reject(res.data)
                    }
                    //其它异常
                    else {
                        reject(res.data);
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /**
     * axios  Get请求
     * @param service  服务器api
     * @param params  路径参数
     * @param isEncrypt  data是否加密
     * @returns {Promise}
     * @constructor
     */
    get(service, params, isEncrypt) {
        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt);
            config.params = params;
            axios.get(service, config)
                .then(res => {
                    //请求成功回调
                    if (res.data.code === 200) {
                        console.log('%c ' + service + '结果:', 'color:orange;', res.data.body);
                        resolve(res.data.body);
                    }//服务器错误
                    else if (res.data.code === 409) {
                        //返回为空
                        resolve("");
                    }
                    else if (res.data.code === 500) {
                        reject(res.data.message ? res.data : {code: 500, message: "服务器异常，错误码：500"});
                    }
                    //其它异常
                    else {
                        reject(res.data);
                    }
                })
                .catch(err => {
                    reject(err);
                })

        })
    }
};

export function getTemp() {
    let temp = localStorage.getItem("timestamp");
    if (!temp) {
        http.get(service.timestamp, {})
            .then(res => {
                if (res) {
                    const obj = {
                        temp: res.timestamp,
                        currentTemp: Date.parse(new Date())
                    };
                    localStorage.setItem("timestamp", JSON.stringify(obj));
                }
            })
            .catch(err => {
                Message.error("获取systemTime失败")
            })
    }
}


/***
 * 不需要验证resultCode 的API
 * @param api
 * @returns {boolean}
 */
function checkUrl(api) {
    return noCheckUrl.some((v, i) => (v === api));
}

export default http;