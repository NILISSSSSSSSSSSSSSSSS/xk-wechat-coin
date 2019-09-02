<template>
    <div class='register'>
        <div class="register-box">
            <img src="../assets/images/photoPerson.png" class="personImg"/>
            <div style="font-size: 14px;color: #222222;line-height: 14px;margin-bottom: 54px;margin-top: 65px;">JESSICA MORGAN</div>
            <reg-input placeholder="请输入您的手机号" v-model="verification.phone" type="number"></reg-input>
            <reg-input placeholder="请输入验证码" type="number" v-model="verification.code">
                <div slot="foot" class="canSend" @click="fnSend" style="cursor: pointer">
                    {{btnTip}}
                </div>
            </reg-input>
            <div class="register-btn" @click="fnRegister" :class="{disable}">下一步</div>
        </div>
    </div>
</template>
<script>
    import RegInput from "@/components/RegInput";
    export default {
        name: 'verifyPhone',
        data() {
            return {
                verification:{
                    phone:"",
                    code:"",
                },
                canSend:true,
                btnTip:"发送验证码",
                BtnName: '',
                disable:false
            };
        },
        components: {
            RegInput,
        },
        computed: {},
        created() {

        },
        mounted() {},
        methods: {
            //发送短信验证码
            fnSend(){
                if (this.verification.phone == '') {
                    this.$toast("电话号码不能为空！");
                    return false;
                }
                if (this.verification.phone.length>11||this.verification.phone.length<6) {
                    this.$toast("请输入正确格式的手机号码！");
                    return false;
                }
                let data = {
                    phone:this.verification.phone,
                    bizType: 'VALIDATE'
                };
                this.$http.get(this.$api.sendAuthMessage, data, true)
                    .then((res) => {
                        this.$toast("验证码以发送至你手机！");
                        // this.btnTip = '';
                        this.BtnName = 60;
                        const timeId = setInterval(() => {
                            this.BtnName--;
                            this.btnTip =  this.BtnName;
                            if (this.BtnName < 1) {
                                this.btnTip = "发送验证码";
                                clearInterval(timeId);
                            }
                        }, 1000);
                    }).catch((err) => {
                    this.$notify(err.message);
                });
            },
            //下一步
            fnRegister(){
                if (this.verification.phone == ''||this.verification.phone.length>11||this.verification.phone.length<6) {
                    this.$toast("请输入正确格式的手机号码！");
                    return false;
                }
                if (this.verification.code == ''||this.verification.code.length<3||this.verification.code.length>6) {
                    this.$toast("请输入正确格式的验证码！");
                    return false;
                }
                let data={
                    phone:this.verification.phone,
                    code:this.verification.code,
                };
                this.$loading();
                this.$http.post(this.$api.smsCodeValidate,data, true).then((res) => {
                    this.$loading.close();
                    this.$router.push('/setPayPassword');
                }).catch((err) => {
                    this.$loading.close();
                    this.$notify(err.message);
                });
            },
        },
    }
</script>
<style scoped lang="scss">
    .register{
        height: 100vh;
        background: #f6f6f6;
        position: relative;
        .personImg{
            width: 102px;
            height: 102px;
            position: absolute;
            top: -14.66667vw;
            left: 110px;
        }
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
            top:16vw;
            background: #FFFFFF;
            box-shadow: 0 2px 15px 0 rgba(67,67,67,0.20);
            border-radius: 10px;
            width: 320px;
            /*height: 430px;*/
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
                margin-top: 137.5px;
                margin-bottom: 54px;
                box-shadow: 0 0 10px #4A90FA;
                &:active{
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1),0 0 10px #4A90FA;
                }
            }
        }
    }
</style>