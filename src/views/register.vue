<template>
    <div>
        <div class='register'>
            <img src="//sh.xksquare.com/game-register-bg.png" alt="" class="register-bg">
            <div class="register-box">
                <reg-input placeholder="请输入您的手机号" v-model="register.phone" :error="checkForm.phone"></reg-input>
                <reg-input placeholder="请输入验证码" type="tel" v-model="register.code" :error="checkForm.code">
                    <div slot="foot" :class="{canSend}" @click="fnSend">
                        {{btnTip}}
                    </div>
                </reg-input>
                <reg-input placeholder="请输入密码（6-20位）" v-model="register.password" :error="checkForm.password" type="password"></reg-input>
                <reg-input placeholder="请输入安全码（推荐）" type="tel" v-model="register.referralCode" :error="checkForm.referralCode">
                    <div slot="foot" class="sao" @click="fnScan">
                        <img src="../assets/images/sao.png" alt="">
                    </div>
                </reg-input>
                <div class="tip">
                    <span>*</span>
                    安全码可在推荐人或已注册用户处获取
                </div>
                <div class="tip">
                    <span>*</span>
                    密码可用大小写英文字母、数字、除空格外的特殊符号组成6-20位
                </div>
                <div class="agreement">
                    <van-checkbox v-model="checked" class="checkbox" shape="square">
                        我已阅读并同意
                    </van-checkbox>
                    <span class="argee" @click="fnRead('UA_APP_USER_PROTOCOL')">《用户协议》</span>
                    <span class="argee" style="color:#999">和</span>
                    <span class="argee" @click="fnRead('UA_PRIVACY_PROTOCOL')">《隐私协议》</span>
                </div>
                <div class="register-btn" @click="fnRegister" :class="{disable}">注 册</div>
            </div>
        </div>
    </div>

</template>
<script>
    import RegInput from "@/components/RegInput";
    import {saveUserInfo,getUserInfo} from "@/util/publicMehotds"
    import wx from 'weixin-jsapi'
    import wechatMixin from '@/mixins/wechatMixin'
    import {mapState,mapMutations} from "vuex"
    export default {
        name: 'register',
        mixins: [wechatMixin ],
        data() {
            return {
                register:{
                    phone:"",
                    code:"",
                    password:"",
                    referralCode:"",
                },
                checkForm:{
                    phone:{
                        value:'',
                        status:false
                    },
                    code:{
                        value:'',
                        status:false
                    },
                    password:{
                        value:'',
                        status:false
                    },
                    referralCode:{
                        value:'',
                        status:false
                    },
                },
                checked:false,
                canSend:true,
                btnTip:"发送验证码",
                
                disable:false
            };
        },
        props: {},
        components: {
            RegInput
        },
        computed: {},
        created() {
            this.getWxConfig();
        },
        mounted() {},
        methods: {
            ...mapMutations({
                setInfo:'setInfo'
            }),
            getWxConfig(){
                let url = location.origin + location.pathname ;
                this.$http.get(this.$api.xkUserGzhConfig, {url}, true).then((res) => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.appId, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.nonceStr, // 必填，生成签名的随机串
                        signature: res.sign,// 必填，签名
                        jsApiList: [
                            'chooseWXPay',
                            'scanQRCode',
                            'translateVoice'
                        ] // 必填，需要使用的JS接口列表
                    });
                }).catch((err) => {
                    this.$notify(err.message);
                });
            },
            async fnSend(){
                let oB = await this.fnValidate('phone');
                if(oB && this.canSend){
                    this.$http.get(this.$api.sendAuthMessage,{
                        phone:this.register.phone,
                        bizType:"REGISTER"
                    } , true).then((res) => {
                        // this.$toast('发送成功');
                    }).catch((err) => {
                        this.$notify(err.message);
                    });
                    this.canSend = false ;
                    let time = 59 ;
                    this.btnTip = `${time}s`
                    this.timer = setInterval(() => {
                        time--;
                        if(time>=0){
                            this.btnTip = `${time}s`
                        }else{
                            this.btnTip = '重新发送';
                            this.canSend = true ;
                        }
                    }, 1000);
                }
            },
            fnRead(contractConfigKey){
                this.$router.push({
                    path:"/agreement",
                    query:{
                        contractConfigKey:contractConfigKey
                    }
                });
            },

            fnRegister(){
                if(this.disable){
                    this.$notify('请勿重复提交');
                    return
                }
                if(!this.checked){
                    this.$toast('请阅读并同意用户协议')
                }else{
                    // console.log((getUserInfo()));
                    // let userInfo = JSON.parse(getUserInfo());
                    let userInfo = JSON.parse(sessionStorage.getItem('mixinInfo'));
                    console.log('userInfo',userInfo);
                    Promise.all([
                        this.fnValidate('phone'),
                        this.fnValidate('code'),
                        this.fnValidate('password'),
                        this.fnValidate('referralCode')
                    ]).then(res=>{
                        let params = {
                            ...userInfo,
                            ...this.register
                        };
                        console.log('注册参数',JSON.stringify(params));
                        this.disable = true ;
                        this.$loading();
                        this.$http.get(this.$api.xkUserGzhRegister,params , true).then((res) => {
                            this.$loading.close();
                            saveUserInfo(res);
                            this.setInfo(res);
                            // this.$router.push('/regSuccess');
                            this.$router.push('/xkCoinRecharge');
                            this.disable = false ;

                        }).catch((err) => {
                            this.$loading.close();
                            this.disable = false ;
                            this.$notify(err.message);
                        });
                    })
                }
            },
            fnScan(){
                let _this = this
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success(res){
                        let result = res.resultStr.split('securityCode=')[1]; // 当needResult 为 1 时，扫码返回的结果
                        _this.register.referralCode = result;
                    }
                });
            },
            fnValidate(oStr){
                return new Promise((resolve,reject)=>{
                    let val = this.register[oStr].trim();
                    switch (oStr) {
                        case 'phone':
                            if(!val){
                                this.checkForm[oStr] = {
                                    value:'请输入手机号',
                                    status:true
                                }
                                reject(false) ;
                            }else{
                                if(val.length==11){
                                    if(val > '13'){
                                        this.checkForm[oStr] = {
                                            value:'',
                                            status:false
                                        }
                                        resolve(true) ;
                                    }else{
                                        this.checkForm[oStr] = {
                                            value:'手机格式不对',
                                            status:true
                                        }
                                        reject(false) ;
                                    }
                                }else{
                                    this.checkForm[oStr] = {
                                        value:'手机位数不对',
                                        status:true
                                    }
                                    reject(false) ;
                                }
                            }
                            break;
                        case 'code':
                            if(!val){
                                this.checkForm[oStr] = {
                                    value:'请输入验证码',
                                    status:true
                                }
                                reject(false) ;
                            }else{
                                this.checkForm[oStr] = {
                                    value:'',
                                    status:false
                                }
                                resolve(true) ;
                            }
                            break;
                        case 'password':
                            if(!val){
                                this.checkForm[oStr] = {
                                    value:'请输入密码',
                                    status:true
                                }
                                reject(false) ;
                            }else{
                                if(val.length>=4 && val.length <=20){
                                    this.checkForm[oStr] = {
                                        value:'',
                                        status:false
                                    }
                                    resolve(true) ;
                                }else{
                                    this.checkForm[oStr] = {
                                        value:'密码为6~20位',
                                        status:true
                                    }
                                    reject(false) ;
                                }
                            }
                            break;
                        case 'referralCode':
                            if(!val){
                                this.checkForm[oStr] = {
                                    value:'请输入安全码',
                                    status:true
                                }
                                reject(false) ;
                            }else{
                                this.checkForm[oStr] = {
                                    value:'',
                                    status:false
                                }
                                resolve(true) ;
                            }
                            break;
                    
                        default:
                            break;
                    }
                })
                
            }
        },
        watch: {
        }
    }
</script>
<style scoped lang="scss">
    .register{
        position: relative;
        .disable{
            opacity: 0.6;
            color: #999
        }
        
        .register-bg{
            width: 100%;
        }
        .register-box{
            width: calc(100% - 56px);
            position: absolute;
            left: 28px;
            top: 196px;
            background: #FFFFFF;
            box-shadow: 0 2px 15px 0 rgba(67,67,67,0.20);
            border-radius: 10px;
            width: 320px;
            height: 430px;
            padding: 22px 15px;
            .canSend{
                color: #4A90FA;
            }
            .sao{
                height: 100%;
                display: flex;
                align-items: center;
                img{
                    width: 20px;
                }
            }
            .tip{
                font-size: 12px;
                color: #555555;
                letter-spacing: 0;
                line-height: 17px;
                text-align: left;
                margin-bottom: 5px;
                position: relative;
                span{
                    position: absolute;
                    left: -8px;
                }
            }
            .agreement{
                padding-top: 6px;
                display: flex;
                margin-bottom: 24px;
                .checkbox{
                    height: 16px;
                    font-size: 12px;
                    text-align: left;
                    /deep/.van-checkbox__icon{
                        height: 16px;
                        line-height: 14px;
                        
                        .van-icon{
                            width: 14px;
                            height: 14px;
                        }
                        
                    }
                    /deep/.van-checkbox__label{
                        height: 14px;
                        line-height: 14px;
                        color: #999;
                        
                    }
                }
                .argee{
                    font-size: 12px;
                    color: #4A90FA;
                    line-height: 14px
                }
            }
            .register-btn{
                width: 100%;
                height: 40px;
                background: #4A90FA;
                border-radius: 20px;
                text-align: center;
                line-height: 40px;
                color: #FFFFFF;
                font-size: 17px;
                box-shadow: 0 0 10px #4A90FA;
                &:active{
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1),0 0 10px #4A90FA;
                }
            }
        }
    }
</style>