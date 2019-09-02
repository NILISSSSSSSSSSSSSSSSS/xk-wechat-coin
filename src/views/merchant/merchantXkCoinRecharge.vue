<template>
    <div>
        <div class="xkCoinRechargeInfo">
            <div class="pubCard1">
                <div class="rechargeCoin marginBottom18">
                    <span class="title1">联盟商姓名</span>
                    <span class="title2">{{xkCoinInfo.realName}}</span>
                </div>
                <div class="rechargeCoin marginBottom18">
                    <span class="title1">联盟商ID</span>
                    <span class="title2">{{xkCoinInfo.merchantId}}</span>
                </div>
                <div class="rechargeCoin marginBottom18">
                    <span class="title1">晓可币余额</span>
                    <span class="title2">{{xkCoinInfo.usable}}</span>
                </div>
            </div>

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
                           placeholder="请输入数量" type="number" oninput="if(value.length>1)value=value.slice(0,7)"
                           @blur="blurxkCoin(xkCoinNumber)"/>
                </div>
                <div style="display: flex; justify-content: space-between;padding: 15px;">
                    <span style="font-size: 14px;color: #222222;">支付金额：</span>
                    <span style="font-size: 17px;color: #EE6161;">¥{{openPrice}}</span>
                </div>
            </div>

            <div style="display: flex;justify-content: start;margin-bottom: 20px;">
                <van-checkbox v-model="checked" shape="square">
                    <span style="font-size: 14px;color: #999999;">我已阅读并同意</span>
                </van-checkbox>
                <router-link :to="{path:'agreement',query:{contractConfigKey:'MAM_XKB_RECHARGE_RULE'}}">
                    <span style="font-size: 14px;color: #4A90FA;">《充值服务协议》</span>
                </router-link>
            </div>
            <van-button :class="[xkCoinNumber&&xkCoinNumber>0?'buttonStyle2':'buttonStyle1']"
                        :disabled="xkCoinNumber&&xkCoinNumber>0?false:true"
                        @click="immediateRecharge">立即充值
            </van-button>
        </div>
    </div>
</template>

<script>
    import {getUserInfo, getMerchantUserInfo, saveMerchantUserInfo, throttle} from '../../util/publicMehotds'
    import wx from "weixin-jsapi";

    let _this = null;
    export default {
        name: "xkCoinRecharge",
        components: [],
        data() {
            return {
                userInfo: {},
                checked: true,
                show: false,
                xkCoinNumber: '',   //晓可币数量
                openPrice: 0.00,//支付的钱
                payChannelArr: [],  //支付渠道類型
                xkCoinInfo: {},    //晓可币充值詳情
            }
        },
        created() {
            _this = this;
            this.getWXConfig();  //获取微信配置
        },
        mounted() {
            this.userInfo = getMerchantUserInfo() ? JSON.parse(getMerchantUserInfo()) : {};
            if (this.userInfo.token) {
                this.getXkUsable();
            } else {
                this.$router.push('/accontVerification');
            }
        },
        methods: {
            //微信配置
            getWXConfig() {
                let url = window.location.href.split("#")[0];
                this.$http.post(this.$api.xkUserGzhConfig, {url: url}, true)
                    .then((res) => {
                        // this.$toast(JSON.stringify(res));
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
                let checkInteger = /^[1-9]\d*$/g;
                if (res && !checkInteger.test(res)) {
                    this.xkCoinNumber = '';
                    this.openPrice = 0.00;
                    this.$toast('充值晓可币数只能是正整数!');
                }
            },
            // 查询晓可币详情
            getXkUsable() {
                this.$loading();
                this.$http.get(this.$api.muserAccDetail, {"currency": 'xkb'}, true).then((res) => {
                    this.$loading.close();
                    console.log('晓可币详情', res);
                    this.xkCoinInfo = res.userAccXkb;
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

                if (_this.checked == false) {
                    _this.$toast('请阅读并同意充值服务协议');
                    return false;
                }
                _this.onInput();
            },

            //支付
            onInput() {
                console.log('openid', this.userInfo.openid);
                let data = {
                    amount: this.openPrice * 100,
                    payChannel: 'gzh',
                    openId: this.userInfo.openid ? this.userInfo.openid : ''
                };
                _this.$loading();
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
                                this.$router.push({path: '/isRechargeSucc', query: {isMerchantRecharge: 'YES'}});
                            } else {
                                this.$router.push({path: '/isRechargeFail', query: {isMerchantRecharge: 'YES'}});
                            }
                        }
                    })
                }).catch((err) => {
                    this.$notify(err.message);
                }).finally(() => {
                    _this.$loading.close()
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .xkCoinRechargeInfo {
        height: 100vh;
        background: #f6f6f6;
        padding: 11px 10px;

        .pubCard {
            background: #FFFFFF;
            border-radius: 8px;
            width: 355px;
            margin-bottom: 10px;
        }

        .pubCard1 {
            background: #FFFFFF;
            border-radius: 8px;
            width: 355px;
            margin-bottom: 10px;
            padding: 15px;

            .rechargeCoin {
                text-align: left;

                .title1 {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #777777;
                    display: inline-block;
                    margin-right: 14px;
                    width: 90px;
                }

                .title2 {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #222222;
                }
            }
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

        /deep/ input {
            text-align: right;
            height: 40px;
            line-height: 40px;
            font: inherit;
            color: inherit;
            width: 220px;
        }
    }
</style>