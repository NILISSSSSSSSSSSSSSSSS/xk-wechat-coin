import {baseUrl} from '../util/publicParams'
let platform = "wx";   //用户的

export default {
    timestamp: baseUrl + "sys/" + platform + "/systemTime/1.0",
    getopenid: baseUrl + "external/payment/getOpenId",
    xkUserGzhLogin: baseUrl + `user/${platform}/xkUserGzhLogin/1.0`,//登录（刘国权）

    xkUserGzhBindPhone: baseUrl + `user/${platform}/xkUserGzhBindPhone/1.0`,//绑定手机号（刘国权）
    xkUserGzhBindPhoneByPwd: baseUrl + `user/${platform}/xkUserGzhBindPhoneByPwd/1.0`,//通过密码绑定手机号（刘国权）
    xkUserGzhRegister: baseUrl + `user/${platform}/xkUserGzhRegister/1.0`,//注册（刘国权）

    xkUserGzhOpenidLogin: baseUrl + `user/${platform}/xkUserGzhOpenidLogin/1.0`,//openId登录（邓小江）
    platformPtotocolConfigDetail: baseUrl + `sys/${platform}/platformPtotocolConfigDetail/1.0`,//平台协议设置详情/充值协议（王琪）


    //用户充值--------------------------
    xkUserGzhConfig: baseUrl + `user/${platform}/xkUserGzhConfig/1.0`,//获取公众号配置（刘国权）
    xkbPayChannel: baseUrl + `trade/${platform}/xkbPayChannel/1.0`,//晓可币支付方式（赵昱）
    userAccDetail: baseUrl + `trade/${platform}/userAccDetail/1.0`,//用户账户明细（王鹏）
    uniPaymentXkbCharge: baseUrl + `trade/${platform}/uniPaymentXkbCharge/1.0`,//用户账户明细（王鹏）
    xkUserSecurityIsSet: baseUrl + `user/${platform}/xkUserSecurityIsSet/1.0`,//是否设置支付密码（雷国敏）
    xkUserPaySecuritySetPassword: baseUrl + `user/${platform}/xkUserPaySecuritySetPassword/1.0`,//设置支付密码 (雷国敏)
    sendAuthMessage: baseUrl + `sys/${platform}/sendAuthMessage/1.0`,//发送验证短信（闫菘）
    smsCodeValidate: baseUrl + `sys/${platform}/smsCodeValidate/1.0`,//验证码校验（雷国敏）
    xkUserUpdateReferralCode: baseUrl + `user/${platform}/xkUserUpdateReferralCode/1.0`,//填写邀请码（闫菘）

    //商户充值---------------------------
    mUserGzhLogin: baseUrl + `user/${platform}/mUserGzhLogin/2.0`,//公众号登录（刘国权）
    muserAccDetail: baseUrl + `trade/${platform}/muserAccDetail/1.0`,//用户账户明细（王鹏）
}
