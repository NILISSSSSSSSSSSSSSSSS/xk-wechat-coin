<template>
    <div>
        <!--<div class="coin-loading" v-if="loading">-->
        <!--<div class="loading">-->
        <!--<van-loading type="spinner" color="#666" />-->
        <!--</div>-->
        <!--</div>-->
        <div class="xkCoinRechargeInfo">
            <div style="font-size: 14px;color: #222222;margin-bottom: 15px;text-align: left;">验证联盟商帐号</div>
            <div class="pubCard">
                <div class="solidbottom1px">
                    <input class="phoneInfo" placeholder="请输入手机号" v-model="verification.phone"
                           oninput="if(value.length>1)value=value.slice(0,11)" type="number"></input>
                </div>
                <div>
                    <input type="password" class="passwordInfo" placeholder="请输入密码"
                           v-model="verification.password"></input>
                </div>
            </div>

            <van-button :class="[verification.phone||verification.password?'buttonStyle2':'buttonStyle1']"
                        :disabled="verification.phone||verification.password?false:true" @click="immediateRecharge">确定
            </van-button>
        </div>
    </div>

</template>

<script>
    import {queryParam, getMerchantUserInfo, saveMerchantUserInfo, throttle} from '../../util/publicMehotds'
    import {appid} from '../../util/publicParams'

    let _this = null;
    export default {
        name: "accontVerification",
        data() {
            return {
                code: queryParam("code"),
                verification: {
                    phone: "",
                    password: "",
                },
            }
        },
        mounted() {
            this.signIn();
        },
        created() {
            _this = this;
        },
        methods: {
            signIn() {
                if (!this.code) {   //获取微信的code
                    let url = window.location.href;
                    let scope = "snsapi_userinfo";
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect";
                }
            },

            //登录
            immediateRecharge() {
                if (!_this.verification.phone) {
                    _this.$toast("请输入正确格式的手机号码！");
                    return false;
                }
                if (!_this.verification.password) {
                    _this.$toast("密码不能为空！");
                    return false;
                }
                let data = {
                    code: _this.code,
                    phone: _this.verification.phone,
                    password: _this.verification.password,
                };
                console.log('所传参数', data);
                _this.$loading();
                _this.$http.post(_this.$api.mUserGzhLogin, data, true)
                    .then((res) => {
                        _this.$loading.close();
                        console.log('微信登陆信息', res);
                        saveMerchantUserInfo(res);
                        let origin = window.location.origin;
                        let pathname = window.location.pathname;
                        window.location.replace(origin + pathname + '#/merchantXkCoinRecharge');
                    }).catch((err) => {
                    _this.$loading.close();
                    _this.$notify(err.message);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    /*.coin-loading{
        .loading{
            width:100%;
            height:200px;
            position:absolute;
            top:50%;
            left:50%;
            margin-top:-100px;
            margin-left:-1px;
        }
    }*/
    .xkCoinRechargeInfo {
        height: 100vh;
        background: #f6f6f6;
        padding: 16px 10px;

        .pubCard {
            text-align: left;
            background: #FFFFFF;
            border-radius: 8px;
            width: 355px;
            padding: 15px;
            margin-bottom: 30px;

            .phoneInfo {
                margin-bottom: 15px;
                font-size: 14px;
                color: #222222;
                width: 100%;
            }

            .passwordInfo {
                margin-top: 15px;
                font-size: 14px;
                color: #222222;
                width: 100%;
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
    }
</style>