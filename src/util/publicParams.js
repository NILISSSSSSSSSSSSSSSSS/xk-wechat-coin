
/**
 * 公共变量
 */

export const baseUrl = "/api/"

/**
 * 签名密匙signKey
 * @type {string}
 */
export const signKey = "e10adc3949ba59abbe56e057f20f883e";

/**
 * 4177 签名key
 * @type {string}
 */
export const secret_key = "ac7f7e9e72280ced6db459200b775a1f";

/**
 * data加密密匙dataKey
 * @type {string}
 */
export const dataKey = "c33367701511b4f6020ec61ded352059";

/**
 * web公共盐值
 * @type {number}
 */
export const saltNum = 946283;

/**
 * catch  版本管理
 * @type {number}
 */
export const catch_version = 1.1;

/**
 * [localStorage  sessionStorage  cookie] key 值管理
 * @type {{userInfo: string}}
 */
export const alias = {
    userInfo: "xk_coin_user",
    merchantUserInfo: "xk_coin_merchant",
    catchVersion: "coin_catch_version",
    guid: "coin_guid",
    temp: "timestamp"
};

/**
 * 微信公众号APPID
 * @type {string}
 */
const host = location.hostname;
let app_id = "wxb2b3f0888cb42788"; //生产环境
if(host === "devw.xksquare.com" || host === "testw.xksquare.com"){
    //开发环境 //测试环境 使用同一个公众号
    app_id = "wx6b60ee1dd30a2908"
}else if(host === "final.xksquare.com"){
    //预发布环境
    app_id = "wx291c2533dec74f6e";
}
export const appid = app_id;