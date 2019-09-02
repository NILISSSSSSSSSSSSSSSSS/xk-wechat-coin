<template>
    <div>
        <div class="xkCoinRechargeInfo">
            <div class="tip">余额：{{xkCoinusable}}晓可币</div>
            <div class="pubCard">
                <div class="solidbottom1px" style="display: flex;justify-content: space-between; padding: 15px;">
                    <div>
                        <div style="font-size: 14px;color: #222222;padding-bottom: 5px;">充值晓可币数
                        </div>
                        <div style="font-size: 12px;color: #CCCCCC;letter-spacing: 0.11px;text-align: left;">
                            1晓可币=¥1.00
                        </div>
                    </div>
                    <input class="inputInfo" @click="$refs.focus.focus()" ref="focus" v-model="xkCoinNumber"
                           placeholder="请输入充值晓可币数" type="number"
                           oninput="if(value.length>1)value=value.slice(0,7)"
                           @blur="blurxkCoin(xkCoinNumber)"/>
                </div>
                <div style="display: flex; justify-content: space-between;padding: 15px;">
                    <span style="font-size: 14px;color: #222222;">支付金额：</span>
                    <span style="font-size: 17px;color: #EE6161;">¥{{openPrice}}</span>
                </div>
            </div>

            <!--第二排支付-->
            <div class="pubCard">
                <van-radio-group v-model="radio">
                    <div style="display: flex;justify-content: space-between; padding: 15px;"
                         v-for="(items,index) of payChannelArr" :key="index" class="solidbottom1px">
                        <div style="display: flex;justify-content: start;">
                            <div style="display: flex;align-items: center;">
                                <img src="../assets/images/wxpay.png"
                                     style="width: 20px;height: 20px;margin-right: 10px;"
                                     v-if="items.payChannel=='gzh'"/>
                                <img src="../assets/images/consumerCoupon.png"
                                     style="width: 20px;height: 20px;margin-right: 10px;" v-else/>
                            </div>
                            <div class="wxInfo">
                                <div style="padding-bottom: 5px;">
                                <span style="font-size: 14px;color: #222222;letter-spacing: 0.13px;">
                                    {{items.payChannel=='gzh'?'微信':'消费券'}}</span>
                                    <span style="font-size: 14px;color: #CCCCCC;letter-spacing: 0.13px;"
                                          v-if="items.payChannel=='xfq'">
                                    (余额：{{items.amount}})</span>
                                </div>
                                <div style="font-size: 12px;color: #999999;letter-spacing: 0.11px; text-align: left;">
                                    {{items.payChannel=='gzh'?'微信安全支付':'1消费券=¥1.00'}}
                                </div>
                            </div>
                        </div>
                        <van-radio-group v-model="radio">
                            <van-radio name="xfq" v-if="items.payChannel=='xfq'"
                                       :disabled="parseFloat(openPrice)>parseFloat(items.amount)?true:false"/>
                            <van-radio name="gzh" v-else/>
                        </van-radio-group>
                    </div>
                </van-radio-group>
            </div>
            <div style="display: flex;justify-content: start;margin-bottom: 20px;">
                <van-checkbox v-model="checked" shape="square">
                    <span style="font-size: 14px;color: #999999;">我已阅读并同意</span>
                </van-checkbox>
                <router-link :to="{path:'agreement',query:{contractConfigKey:'UA_XKB_RECHARGE_RULE'}}">
                    <span style="font-size: 14px;color: #4A90FA;">《充值服务协议》</span>
                </router-link>
            </div>
            <van-button
                    @click="immediateRecharge" :class="[xkCoinNumber&&xkCoinNumber>0?'buttonStyle2':'buttonStyle1']"
                    :disabled="xkCoinNumber&&xkCoinNumber>0?false:true">立即充值
            </van-button>
            <!--数字键盘-->
            <van-popup v-model="show" position="bottom" :overlay="true">
                <div class="inputPassword">请输入支付密码</div>
                <van-password-input
                        :value="radioValue"
                        style="background: #FFFFFF;box-shadow: 0 0 1px 0 rgba(215,215,215,0.50);border-radius: 6px;"
                />
                <div class="forgetPassword">
                    <router-link to="/verifyPhone">
                        <span class="textInfo">忘记密码？</span>
                    </router-link>
                </div>
                <van-number-keyboard
                        extra-key="."
                        :show="show"
                        @input="onInput"
                        @delete="onDelete"
                />
            </van-popup>

        </div>
    </div>
</template>

<script>
    import {getUserInfo, throttle} from '../util/publicMehotds'
    import wx from "weixin-jsapi";

    let _this = null;
    export default {
        name: "xkCoinRecharge",
        components: [],
        data() {
            return {
                userInfo: {},
                radio: '',
                checked: true,
                show: false,
                radioValue: '',     //支付密码
                xkCoinNumber: '',   //晓可币数量
                openPrice: 0,       //支付的钱
                payChannelArr: [],  //支付渠道類型
                xkCoinusable: '',    //晓可币总额
            }
        },
        created() {
            _this = this;
            this.getWXConfig();
        },
        mounted() {
            this.userInfo = getUserInfo('xk_coin_user') ? JSON.parse(getUserInfo('xk_coin_user')) : {};
            this.getXkbPayChannel();
            this.getXkUsable();
        },
        methods: {
            //微信配置
            getWXConfig() {
                this.$http.post(this.$api.xkUserGzhConfig, {url: window.location.href.split('#')[0]}, true)
                    .then((res) => {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: res.appId, // 必填，公众号的唯一标识
                            timestamp: res.timestamp, // 必填，生成签名的时间戳
                            nonceStr: res.nonceStr, // 必填，生成签名的随机串
                            signature: res.sign,// 必填，签名
                            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                        })
                    })
                    .catch(err => {
                        this.$notify(err.message);
                    })
            },
            //输入的晓可币数量
            blurxkCoin(res) {
                this.openPrice = res;
                let amount = '';
                let checkInteger = /^[1-9]\d*$/g;

                if (res && !checkInteger.test(res)) {
                    this.xkCoinNumber = '';
                    this.openPrice = 0;
                    this.$toast('充值晓可币数只能是正整数!');
                } else {
                    for (let value of this.payChannelArr) {
                        amount = value.amount;
                    }
                    if (parseFloat(this.openPrice) > parseFloat(amount)) {
                        this.radio = '';
                    }
                }
            },
            //获取支付渠道
            getXkbPayChannel() {
                this.$http.get(this.$api.xkbPayChannel, {}, true).then((res) => {
                    console.log('支付渠道', res);
                    this.payChannelArr = res;

                }).catch((err) => {
                    this.$notify(err.message);
                });
            },
            //查询晓可币详情
            getXkUsable() {
                this.$loading();
                this.$http.get(this.$api.userAccDetail, {"currency": 'xkb'}, true).then((res) => {
                    this.$loading.close();
                    console.log('晓可币详情', res);
                    this.xkCoinusable = res.userAccXkb.usable;
                }).catch((err) => {
                    this.$loading.close();
                    this.$notify(err.message);
                });
            },
            //充值
            immediateRecharge() {
                if (!_this.xkCoinNumber) {
                    _this.$toast('请填写要充值的数量币数');
                    return false;
                }
                if (!_this.radio) {
                    _this.$toast('请勾选一种充值支付方式');
                    return false;
                }
                if (_this.checked == false) {
                    _this.$toast('请阅读并同意充值服务协议');
                    return false;
                }

                if (_this.radio == 'xfq') {
                    _this.isSetPassword();
                } else {
                    console.log('微信原生支付');
                    _this.onInput();
                    //微信原生支付
                }
            },
            //验证有没有设置支付密码
            isSetPassword() {
                let _this = this;
                this.$http.post(this.$api.xkUserSecurityIsSet, {}, true).then((res) => {
                    // console.log('是否设置密码',res);
                    if (res.textPwdIsSet == 0) {
                        let timer = setTimeout(function () {
                            _this.$toast('你还没设置支付密码，需要先去设置');
                            _this.$router.push('/verifyPhone');
                            clearTimeout(timer);
                        }, 1000);
                    }
                    if (res.textPwdIsSet == 1) {
                        this.show = true;
                    }
                }).catch((err) => {
                    this.$notify(err.message);
                });
            },
            //支付
            onInput(key) {
                if (this.radio == 'xfq') {
                    this.radioValue = (this.radioValue + key).slice(0, 6);
                }
                if (this.radio == 'xfq' && this.radioValue && this.radioValue.length == 6) {
                    let data = {
                        amount: this.openPrice * 100,
                        payChannel: this.radio,
                        authType: 'password',
                        authValue: this.radioValue,
                        openId: this.userInfo.openid ? this.userInfo.openid : ''
                    };
                    this.$loading();
                    this.$http.post(this.$api.uniPaymentXkbCharge, data, true).then((res) => {
                        console.log('返回参数', res);
                        if (res.tradePaymentStatus == 'success') {
                            this.$router.push('/isRechargeSucc');
                        }
                        if (res.tradePaymentStatus == 'false') {
                            this.$router.push('/isRechargeFail');
                        }
                    }).catch((err) => {
                        this.$notify(err.message);
                    }).finally(() => {
                        this.$loading.close();
                    });
                }
                if (this.radio == 'gzh') {
                    let data = {
                        amount: this.openPrice * 100,
                        payChannel: this.radio,
                        openId: this.userInfo.openid ? this.userInfo.openid : ''
                    };
                    this.$loading();
                    this.$http.post(this.$api.uniPaymentXkbCharge, data, true).then((res) => {
                        let payInfo = JSON.parse(res.next.channelPrams.gzhParam);
                        wx.chooseWXPay({
                            timestamp: payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
                            package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: payInfo.paySign, // 支付签f名
                            success: (res) => {
                                // 支付成功后的回调函数
                                if (res.errMsg === "chooseWXPay:ok") {
                                    this.$router.push('/isRechargeSucc');
                                } else {
                                    this.$router.push('/isRechargeFail');
                                }
                            }
                        })
                    }).catch((err) => {
                        this.$loading.close();
                        this.$notify(err.message);
                    }).finally(() => {
                        this.$loading.close();
                    });
                }
            },
            //密码删除
            onDelete() {
                this.radioValue = this.radioValue.slice(0, this.radioValue.length - 1);
            }
        }
    }
</script>

<style scoped lang="scss">
    .xkCoinRechargeInfo {
        height: 100vh;
        background: #f6f6f6;
        padding: 20px 10px;

        .tip {
            font-size: 14px;
            color: #555555;
            text-align: left;
            line-height: 14px;
            margin-bottom: 10px;
        }

        .pubCard {
            background: #FFFFFF;
            border-radius: 8px;
            width: 355px;
            margin-bottom: 10px;
        }

        .buttonStyle1 {
            border-radius: 8px;
            box-shadow: 0 0 4px 0;
            width: 355px;
            height: 44px;
            font-size: 17px;
            color: #fff;
            background: #DFDFDF;
        }

        .buttonStyle2 {
            border-radius: 8px;
            box-shadow: 0 0 4px 0;
            width: 355px;
            height: 44px;
            font-size: 17px;
            color: #fff;
            background: #4A90FA;
        }

        /deep/ .van-cell {
            width: 56vw;
            font-size: 16px;
            line-height: 0px;
            padding: 0;

        }

        /deep/ .van-field__control {
            text-align: right;
        }

        /deep/ .van-checkbox__icon, .van-checkbox__label {
            line-height: 16px;
        }

        /deep/ .van-checkbox__icon .van-icon {
            width: 16px;
            height: 16px;
        }

        /deep/ .van-checkbox__icon {
            height: 16px;
        }

        .inputInfo {
            color: #555555;
            padding-top: 4px;
        }

        .wxInfo {
            display: flex;
            flex-direction: column;
            align-items: start;
            padding-top: 10px;
        }

        /deep/ input {
            text-align: right;
            height: 40px;
            line-height: 40px;
            font: inherit;
            color: inherit;
            width: 220px;
        }

        /deep/ .van-popup--bottom {
            top: 32%;
        }

        .forgetPassword {
            text-align: right;
            margin: 15px 25px 25px auto;

            .textInfo {
                ont-size: 14px;
                color: #4A90FA;
            }
        }

        .inputPassword {
            font-size: 17px;
            color: #222222;
            text-align: center;
            padding: 25px 0 32px 0;
            /*margin: 25px auto 32px auto;*/
        }

        .van-radio {
            padding-top: 16px;
        }
    }
</style>