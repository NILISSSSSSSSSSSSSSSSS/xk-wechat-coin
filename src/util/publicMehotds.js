//公共方法
import CryptoJS from 'crypto-js'
import {signKey, dataKey, saltNum, alias,catch_version} from './publicParams'
import Moment from 'moment';

export function formatDate(time, type = "YYYY-MM-DD HH:mm") {
    time = Number(time) < 10000000000 ? Number(time) * 1000 : time;
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
};

//
export function dayDiff(startDate, endDate) {
    let startTime, endTime;
    if (startDate < 10000000000) {
        startTime = Number(startDate) * 1000;
    }
    if (endDate < 10000000000) {
        endTime = Number(endDate) * 1000;
    }
    return Moment(endTime).diff(Moment(startTime), 'days')
}

/**
 * 判断系统(android/ios)
 * @returns {string}
 */
export const system = () => {
    const u = navigator.userAgent;

    let name;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        name = 'android';
    } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        name = 'ios';
    } else {
        name = 'unknown';
    }

    return name;
};

/**
 * 调用native的方法
 * @param fun  方法名
 * @param params  参数
 */
export function callNative(fun, params, callback) {
    let client = getHashParameter("client");
    if (client == "xk") {
        if (system() === "android") {
            let res = Android[fun](params);
            callback(res);
        } else if (system() === "ios") {
            window.webkit.messageHandlers[fun].postMessage(params);
            window[fun] = (res) => {
                callback(res);
            }
        }
    } else if (client == "sh") {
        window.postMessage([fun, params]);
    }
}

/**
 * 获取路径参数
 * @param key
 * @returns {any}
 */
export function queryParam(key) {
    let obj = getUrlParam();
    return obj[key];
}

function getUrlParam() {
    let url = location.search; //获取url中"?"符后的字符串包括‘？’ ，window.location.href获取的是url完整的字符串
    let theParam = new Object();
    if (url.indexOf("?") != -1) { //确保‘？’不是最后一个字符串，即携带的参数不为空
        let str = url.substr(1); //substr是字符串的用法之一，抽取指定字符的数目，这里抽取？后的所有字符
        let strs = str.split("&"); //将获取到的字符串从&分割，输出参数数组，即输出[参数1=xx,参数2=xx,参数3=xx,...]的数组形式
        for (let i = 0; i < strs.length; i++) { //遍历参数数组
            theParam[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); //这里意思是抽取每个参数等号后面的值，unescape是解码的意思
        }
    }
    return theParam; //返回参数值
}

/**
 * 获取hash参数
 */
export function getHashParameter(key) {
    let params = getHashParameters();
    return params[key];
}

function getHashParameters() {
    let arr = (location.hash || "").replace(/^\#/, '').split("&");
    let lis = arr[0].split("?");
    if (lis.length < 2) {
        return {};
    }
    arr.splice(0, 1);
    arr = arr.concat(lis[1]);
    let params = {};
    for (let i = 0; i < arr.length; i++) {
        let data = arr[i].split("=");
        if (data.length === 2) {
            params[data[0]] = data[1];
        }
    }
    return params;
}


/**
 * 保存cookie
 * @param key
 * @param str
 */
export function saveCookie(key, str) {
    let Days = 1; //此 cookie 将被保存 7 天
    let exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = key + "=" + str + ";expires=" + exp.toGMTString();
}

/**
 * 获取cookie
 * @param key
 * @returns {*}
 */
export function getCookie(key) {  //获取指定名称的cookie的值
    let arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    if (arr != null) {
        return arr[2];
    }
    return null;
}

//判断是否是微信浏览器的函数
export function isWeiXin() {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取随机数
 * @param len   随机数长度
 * @returns {string}
 * @constructor
 */
export function mathRand(len) {
    let num = "";
    for (let i = 0; i < len; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}


/**
 * 3des 加密data
 * @param salt
 * @param data
 * @returns {string}
 */
export function des3(salt, data) {
    const md5_hash = CryptoJS.MD5(salt + "" + dataKey).toString();
    return CryptoJS.TripleDES.encrypt(data, CryptoJS.enc.Utf8.parse(md5_hash), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

/**
 * 3des  data内容解密
 * @param data
 * @param key
 * @returns {string}
 */
export function des3Decrypt(data, key) {
    const md5_hash = CryptoJS.MD5(key + "" + dataKey).toString();
    return CryptoJS.TripleDES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(data)
    }, CryptoJS.enc.Utf8.parse(md5_hash), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}

/**
 * 生成唯一GUID
 */
export function saveGuid() {
    localStorage.setItem(alias.guid, CryptoJS.MD5().toString())
}

/**
 * 获取guid
 */
let guid = "";
export function getGuid() {
    // guid=localStorage.getItem(alias.guid)?localStorage.getItem(alias.guid):'';
    guid=localStorage.getItem(alias.guid)
    if(!guid){
        saveGuid()
        guid=localStorage.getItem(alias.guid)
    }
    return guid
}

/**
 * 重新组装params  生成sign
 * @param service
 * @param param
 * @param isEncrypt  //data是否加密
 * @returns {{service: *, timestamp: number, version: string, salt: string, sign: *, data: string}}
 */
export function assembleParams(service, param, isEncrypt = false) {
    try {
        const user = getUserInfo() ? JSON.parse(getUserInfo()) :sessionStorage.getItem('mixinInfo')?JSON.parse(sessionStorage.getItem('mixinInfo')):{};
        const merchantUser=getMerchantUserInfo()?JSON.parse(getMerchantUserInfo()):{};

        if (user) {
            param.token = user.token;
            param.userId = user.id;
        }
        if(merchantUser.token){
            param.token = merchantUser.token;
            param.userId = merchantUser.id
        }
        // param.token = "64dcac9522dcbc7c2812cdbc13791bab";
        // param.userId = "5ca34b0803345539e259a487";
        param.os = "wx";
        param.guid = getGuid();
        const arr = service.split("/");
        const api = arr[arr.length - 2];
        const version = arr[arr.length - 1];
        const timestamp = getTimestamp();
        const salt = mathRand(6);
        const data = isEncrypt ? des3(salt, JSON.stringify(param)) : JSON.stringify(param);
        console.log('%c ' + service + '参数:', 'color:green;', param);
        return {
            service: api,
            timestamp,
            version: version,
            salt,
            sign: CryptoJS.MD5(api + timestamp + data + version + salt + signKey).toString(),
            data
        };
    } catch (e) {
        console.error(e)
    }

}

/**
 * 去掉url地址中的一个参数
 * @param name
 * @returns {string}
 */
export function funcUrlDel(name) {
    let loca = window.location;
    let baseUrl = loca.origin + loca.pathname + "#";
    let query = loca.hash.substr(1);
    if (query.indexOf(name) > -1) {
        let obj = {}
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }
        delete obj[name];
        return baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
    }
}


function getTimestamp() {
    let temp = localStorage.getItem(alias.temp);
    if (temp) {
        temp = JSON.parse(temp);
        return temp.temp + (Date.parse(new Date()) - temp.currentTemp);
    } else {
        return Date.parse(new Date());
    }
}


function jsBridge(funcName, data, callback) {
    if (system() === "ios") { //ios
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(funcName, data, callback);
        });
    } else if (system() === "android") {
        connectWebViewJavascriptBridge(function (bridge) {
            if (window.WebViewJavascriptBridge) {
                window.WebViewJavascriptBridge.callHandler(
                    funcName
                    , data,
                    callback
                );
            } else {
                bridge.callHandler(funcName, data, callback);
            }
        });
    } else {
        console.log('this is an error ouput');
    }
}

function setupWebViewJavascriptBridge(callback) {

    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 100)
}

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function () {
                callback(WebViewJavascriptBridge)
            }, false);
    }
}

function registerNative(funName) {
    if (system() === "ios") { //ios
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(funcName, function (data, responseCallback) {
            });
        });
    } else if (system() === "android") {
        connectWebViewJavascriptBridge(function (bridge) {
            if (window.WebViewJavascriptBridge) {
                window.WebViewJavascriptBridge.registerHandler(funName, function (data, responseCallback) {
                    console.log("from android", data);
                });
            } else {
                bridge.registerHandler(funName, function (data, responseCallback) {
                    console.log("from android", data);
                });
            }
        });
    }
}

//倒计时
export function countDown(endDateStr, s) {
    //结束时间
    var endDate = new Date(endDateStr);
    //当前时间
    var nowDate = new Date();
    if (endDate - nowDate < 0) {
        s("已结束")
        return;
    }
    //相差的总秒数
    var totalSeconds = parseInt((endDate - nowDate) / 1000);
    //天数
    var days = Math.floor(totalSeconds / (60 * 60 * 24));
    //取模（余数）
    var modulo = totalSeconds % (60 * 60 * 24);
    //小时数
    var hours = Math.floor(modulo / (60 * 60));
    modulo = modulo % (60 * 60);
    //分钟
    var minutes = Math.floor(modulo / 60);
    //秒
    var seconds = modulo % 60;
    //输出到页面
    s(days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ")

    //延迟一秒执行自己
    setTimeout(function () {
        countDown(endDateStr, s);
    }, 1000)
}


/**
 * 加密存储User信息
 * @param user
 */
export function saveUserInfo(user) {
    try {
        // localStorage.setItem(alias.userInfo, JSON.stringify(user));
        localStorage.setItem(alias.userInfo, des3(saltNum, JSON.stringify(user)));
        localStorage.setItem(alias.catchVersion, catch_version)
    } catch (e) {
        console.log(e)
    }
}

/**
 * sessionStorage加密存储merchantUserInfo信息
 * @param user
 */
export function saveMerchantUserInfo(user) {
    try {
        // sessionStorage.setItem(alias.merchantUserInfo, JSON.stringify(user));
        sessionStorage.setItem(alias.merchantUserInfo, des3(saltNum, JSON.stringify(user)));
        sessionStorage.setItem(alias.catchVersion, catch_version)
    } catch (e) {
        console.log(e)
    }
}

/**
 * 解密存储User信息
 * @param user
 */
export function getUserInfo() {
    // return localStorage.getItem(alias.userInfo) ? localStorage.getItem(alias.userInfo, saltNum) : ""|| localStorage.getItem('wx_xksquare_user') ? des3Decrypt(localStorage.getItem('wx_xksquare_user'), saltNum) : ""
    return localStorage.getItem(alias.userInfo) ? des3Decrypt(localStorage.getItem(alias.userInfo), saltNum) : "" || localStorage.getItem('wx_xksquare_user') ? des3Decrypt(localStorage.getItem('wx_xksquare_user'), saltNum) : ""
}

/**
 * sessionStorage解密存储merchantUserInfo信息
 * @param user
 */
export function getMerchantUserInfo() {
    // return sessionStorage.getItem(alias.merchantUserInfo) ? sessionStorage.getItem(alias.merchantUserInfo, saltNum) : ""
    return sessionStorage.getItem(alias.merchantUserInfo) ? des3Decrypt(sessionStorage.getItem(alias.merchantUserInfo), saltNum) : ""
}


/**
 * 更新缓存信息
 */
export function clearWxCatch(isFlag = false) {
    const version = localStorage.getItem(alias.catchVersion)
    if (version != catch_version || isFlag) {
        //版本根系删除必要的缓存数据
        localStorage.removeItem(alias.userInfo);         //删除用户充值的登陆信息
        // sessionStorage.removeItem(alias.merchantUserInfo);  //删除商户充值的登陆信息

    }
}
/**
 * 防抖 n秒内只会执行一次 重复点击会重新计算时间
 */
export function debounce(fn,time=500) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, time);
    };
}

/**
 * 节流 n秒内只会执行一次 重复点击不会重新计算时间
 */
export function throttle(fn,time=500) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, time);
    };
}
