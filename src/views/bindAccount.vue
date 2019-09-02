<template>
    <div>
        <!--<div class="coin-loading" v-if="loading">-->
            <!--<div class="loading">-->
                <!--<van-loading type="spinner" color="#666" />-->
            <!--</div>-->
        <!--</div>-->
        <div class="bind-account">
            <div class="tip">晓可广场公众号需要绑定您的晓可账号</div>
            <van-tabs
                    v-model="active"
                    animated
                    swipeable
                    background="#F6F6F6"
                    title-active-color="#4A90FA"
                    color="#4A90FA"
                    line-width="125"
                    line-height="2"
                    title-inactive-color="#777777"
                    style="border-top:0;margin-bottom:10px"
                    @change="fnChange"
            >
                <van-tab>
                    <div slot="title">
                        使用验证码
                    </div>
                    <div class="code-bind xk-account">
                        <div class="bind-input">
                            <van-field v-model="codeBind.phone" placeholder="请输入手机号" :error-message="phoneError1"/>
                        </div>
                        <div class="bind-input">
                            <van-field v-model="codeBind.code" placeholder="请输入验证码" :error-message="codeError">
                                <div slot="button" :class="{
                                                'send-code':canSend,
                                                'count-down':!canSend
                                                }" @click="fnSendCode">
                                    {{btnTip}}
                                </div>
                            </van-field>
                        </div>
                    </div>
                </van-tab>
                <van-tab>
                    <div slot="title">
                        使用密码
                    </div>
                    <div class="password-bind xk-account">
                        <div class="bind-input">
                            <van-field v-model="passwordBind.phone" placeholder="请输入手机号" :error-message="phoneError2"/>
                        </div>
                        <div class="bind-input">
                            <van-field v-model="passwordBind.password" type="password" placeholder="请输入密码"
                                       :error-message="passwordError"></van-field>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
            <van-button type="info" size="large" class="bind-btn" @click="fnBind">绑定</van-button>
            <div class="register" @click="fnRegister">新用户注册</div>
        </div>
    </div>
</template>
<script>
    import {mapState,mapMutations} from "vuex"
    import {getUserInfo, saveUserInfo, clearWxCatch} from '../util/publicMehotds'
    import wechatMixin from '@/mixins/wechatMixin'

    export default {
        name: 'bindAccount',
        mixins: [wechatMixin],
        data() {
            return {
                active: 0,
                codeBind: {
                    phone: '',
                    code: ""
                },
                passwordBind: {
                    phone: '',
                    password: ''
                },
                btnTip: '发送验证码',
                phoneError1: '',
                codeError: '',
                phoneError2: '',
                passwordError: '',
                timer: null,
                canSend: true,
            }
        },
        components: {},
        mounted() {
            localStorage.setItem("userTest", JSON.stringify({name: "cross", password: "123456"}))
        },
        created() {

        },
        methods: {
            ...mapMutations({
                setInfo:'setInfo'
            }),
            fnChange(index, title) {
                this.fnReset();
            },
            fnSendCode() {
                this.validate('phone');
                if (this.phoneError1) {
                    return
                }
                if (this.canSend) {
                    this.$http.get(this.$api.sendAuthMessage, {
                        phone: this.codeBind.phone,
                        bizType: "LOGIN"
                    }, true).then((res) => {
                        // this.$toast('发送成功');
                    }).catch((err) => {
                        this.$notify(err.message);
                    });
                    clearInterval(this.timer);
                    let time = 59;
                    this.canSend = false;
                    this.btnTip = `${time}s`
                    this.timer = setInterval(() => {
                        time--;
                        if (time >= 0) {
                            this.btnTip = `${time}s`
                        } else {
                            this.btnTip = '重新发送';
                            this.canSend = true;
                        }
                    }, 1000);
                } else {
                    this.$toast('消息已发送');
                }
            },
            fnBind() {
                if (!this.fnValidate()) {
                    return
                }
                // let user = JSON.parse(getUserInfo());
                let user = JSON.parse(sessionStorage.getItem('mixinInfo'));
                let param = {
                    ...this.codeBind,
                    ...user
                }
                console.log("user", user)
                let apiName = "xkUserGzhBindPhone"
                if (this.active) {//密码
                    apiName = "xkUserGzhBindPhoneByPwd"
                    param = {
                        ...this.passwordBind,
                        ...user
                    }
                }
                this.$loading();
                this.$http.get(this.$api[apiName], param, true).then((res) => {
                    this.$loading.close();
                    saveUserInfo(res);
                    this.setInfo(res);
                    if(res.securityCode){
                        this.$router.push('/xkCoinRecharge'); //返回晓可币充值中心
                    }else {
                        this.$router.push('/securityCodeVerificate'); //去验证安全码
                    }
                }).catch((err) => {
                    this.$loading.close();
                    this.$notify(err.message);
                });
            },
            fnRegister() {
                this.$router.push('/register')
            },
            fnValidate() {
                this.validate('phone');
                if (!this.active) {
                    this.validate('code');
                    if (!this.phoneError1 && !this.codeError) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    this.validate('password');
                    if (!this.phoneError2 && !this.passwordError) {
                        return true;
                    } else {
                        return false;
                    }
                }

            },
            validate(oStr) {
                switch (oStr) {
                    case 'phone':
                        if (!this.active) {
                            let phone = this.codeBind.phone.trim();
                            if (phone) {
                                if (phone.length == 11) {
                                    this.phoneError1 = '';
                                    phone > '13' ? this.phoneError1 = '' : this.phoneError1 = '手机格式不对';
                                } else {
                                    this.phoneError1 = '手机位数不对';
                                }
                            } else {
                                this.phoneError1 = phone ? '' : '请输入手机号';
                            }
                        } else {
                            let phone = this.passwordBind.phone.trim();
                            if (phone) {
                                if (phone.length == 11) {
                                    this.phoneError2 = '';
                                    phone > '13' ? this.phoneError2 = '' : this.phoneError2 = '手机格式不对';
                                } else {
                                    this.phoneError2 = '手机位数不对';
                                }
                            } else {
                                this.phoneError2 = phone ? '' : '请输入手机号';
                            }
                        }
                        break;
                    case 'code' :
                        let code = this.codeBind.code.trim();
                        this.codeError = code ? '' : '请输入验证码';
                    case 'password' :
                        let password = this.passwordBind.password.trim();
                        this.passwordError = password ? '' : '请输入密码';
                    default:
                        break;
                }
            },
            fnReset() {
                this.phoneError1 = '';
                this.codeError = '';
                this.phoneError2 = '';
                this.passwordError = '';
                this.codeBind = {
                    phone: '',
                    code: ""
                },
                    this.passwordBind = {
                        phone: '',
                        password: ''
                    }
                clearInterval(this.timer);
                this.btnTip = '发送验证码';
            }
        },
    }
</script>
<style scoped lang="scss">
   /* .coin-loading{
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
    .bind-account {
        height: 100vh;
        background: #f6f6f6;
        padding: 20px 10px;
        .tip {
            font-size: 14px;
            color: #999999;
            text-align: left;
            margin-bottom: 21px;
        }
        .xk-account {
            padding-top: 20px;
        }
        .bind-input {
            margin-bottom: 10px;
            font-size: 14px;
            border-radius: 6px;
            overflow: hidden;
            .count-down {
                color: #999999
            }
            .send-code {
                color: #F4A633
            }
        }
        .bind-btn {
            background: #4A90FA;
            height: 44px;
            line-height: 44px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 17px
        }
        .register {
            font-size: 14px;
            color: #222222;
        }
    }
    /deep/.van-hairline--top-bottom::after{
        border-top-width: 0 !important;
        border-bottom-width: 4px !important;
        margin: 0 80px !important;
    }
    /deep/.van-tabs__wrap{
        padding: 0 30px !important;
    }
</style>