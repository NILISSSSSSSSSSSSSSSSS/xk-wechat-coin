<template>
    <div class="setPayInfo">
        <div class="tip">{{titleInfo}}</div>
        <!--初始密码-->
        <div v-if="isShowTwo==false">
            <van-password-input
                    :value="value1"
                    @focus="showKeyboard1 = true"
            >
            </van-password-input>
            <van-number-keyboard
                    class="passwordBoard"
                    :show="showKeyboard1"
                    @input="onInput1"
                    @delete="onDelete1"
                    @blur="showKeyboard1 = false"
            >
            </van-number-keyboard>
        </div>

        <!--再次输入的密码-->
        <div v-if="isShowTwo==true">
            <van-password-input
                    :value="value2"
                    @focus="showKeyboard2 = true"
            >
            </van-password-input>
            <van-number-keyboard
                    class="passwordBoard2 "
                    :show="showKeyboard2"
                    @input="onInput2"
                    @delete="onDelete2"
                    @blur="showKeyboard2 = false"
            >
            </van-number-keyboard>
        </div>
    </div>
</template>

<script>
    export default {
        name: "setPayPassword",
        data() {
            return {
                titleInfo:'请设置你的支付密码',
                value1: '',
                value2:'',
                showKeyboard1: true,
                showKeyboard2: true,
                isShowTwo:false,
            };
        },
        methods: {
            //重置数据
            clearInfo(){
                this.titleInfo='请设置你的支付密码';
                this.value1='';
                this.value2='';
                this.showKeyboard1=true;
                this.showKeyboard2=true;
            },
            onInput1(key) {
                // console.log('key',key);
                this.value1 = (this.value1 + key).slice(0, 6);
                // console.log('输入的值',this.value1.length);
                if(this.value1.length==6){
                   this.titleInfo='请再次输入';
                   this.isShowTwo=true;
                   return false;
                }
            },
            onInput2(key) {
                this.value2 = (this.value2 + key).slice(0, 6);
                // console.log('输入的值',this.value2.length);
                if(this.value2&&this.value2.length==6){
                    if(this.value2!==this.value1){
                        this.$toast('输入密码与上次不符，请重新输入');
                        this.value2='';
                    }else {
                        let data={
                            textPassword:this.value2,
                        };
                        this.$loading();
                        this.$http.post(this.$api.xkUserPaySecuritySetPassword,data, true).then((res) => {
                            this.$loading.close();
                            let second = 3;
                            const timer = setInterval(() => {
                                second--;
                                if (second) {
                                    this.$toast('设置成功');
                                } else {
                                    clearInterval(timer);
                                    this.$toast.clear();
                                    this.clearInfo();
                                    this.$router.push('/xkCoinRecharge');
                                }
                            }, 500);
                        }).catch((err) => {
                            this.$loading.close();
                            this.$notify(err.message);
                        });
                    }
                }
            },
            onDelete1() {
                this.value1 = this.value1.slice(0, this.value1.length - 1);
            },
            onDelete2() {
                this.value2 = this.value2.slice(0, this.value2.length - 1);
            }
        }
    }
</script>

<style scoped lang="scss">
    .setPayInfo {
        height: 100vh;
        background: #f6f6f6;
        padding: 20px 10px;
        .tip {
            font-size: 14px;
            color: #999999;
            text-align: left;
            margin-bottom: 21px;
        }
        .passwordBoard{
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            box-shadow: 0 0 4px 0 rgba(215,215,215,0.50);
            border-radius: 6px;
        }
    }

</style>