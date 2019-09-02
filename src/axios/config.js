/**
 * Created by qiushaoyu on 2017/12/6.
 */
import Qs from 'qs'
import {des3Decrypt} from '../util/publicMehotds'
import {getTemp} from '../axios'


export default {
    // 基础url前缀
    baseURL: `//${location.hostname}`,
    // baseURL: "http://zzb.tunnel.echomod.cn",
    //设置超时时间
    timeout: 50000,
    //返回数据类型
    responseType: 'json', // default
    // 请求头信息
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded, multipart/form-data'
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },


    // url: '/get',
    // method: 'POST',
    transformRequest: [
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs
        function (data) {
            //由于使用的form-data传数据所以要格式化
            // data = JSON.parse(data);
            data = Qs.stringify(data);
            return data
        }
    ],
    transformResponse: [
        // 这里提前处理返回的数据
        function (data) {
            // console.log(data)
            data.body = data.key ? JSON.parse(des3Decrypt(data.body, data.key)) : data.body ? JSON.parse(data.body) : data.body;
            switch (data.code) {
                case 405: {
                    //删除本地时间戳  重新拉取服务器时间戳
                    localStorage.removeItem("timestamp");
                    getTemp();
                    break;
                }
                case 1413:
                    break;
            }
            return data;
        }
    ],

    //parameter参数
    params: {},

    /* paramsSerializer: function (params) {
     return Qs.stringify(params)
     },
     */
    //post参数
    data: {},


    // withCredentials: false, // default


    //将upload事件注释掉，防止跨域状态下发起option请求

    // onUploadProgress: function(progressEvent) {
    // 	// Do whatever you want with the native progress event
    // },


    // onDownloadProgress: function(progressEvent) {
    // 	// Do whatever you want with the native progress event
    // },


    // maxContentLength: 2000,


    /*  validateStatus: function (status) {
     return status >= 200 && status < 300; // default
     },*/


    // maxRedirects: 5, // default
}
