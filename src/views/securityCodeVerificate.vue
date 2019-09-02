<template>
    <div class="codeVerificate">
        <div class="title">为保障您数据、货币等重要信息的安全，请填写安全码。</div>
        <div class="inputInfo">
            <input @click="$refs.focus.focus()" ref="focus" style="padding: 12px 15px;width: 355px;" v-model="code" placeholder="安全码(必填)" />
        </div>
        <div class="bottomInfo">安全码可在推荐人或已注册用户处获取</div>
        <van-button type="info" style="border-radius: 8px; box-shadow: 0 0 4px 0 ;width: 355px;height: 44px;font-size: 17px"
                    @click="verificate">下一步</van-button>
    </div>
</template>

<script>
    import {mapState,mapMutations} from "vuex"
    import {saveUserInfo, getUserInfo} from "@/util/publicMehotds"
    export default {
        name: "securityCodeVerificate",
        data() {
            return {
            }
        },
        methods:{
            ...mapMutations({
                setInfo:'setInfo'
            }),
            verificate(){
                if(!this.code){
                    this.$toast('输入的安全码不能为空！');
                }else {
                    this.$loading();
                    this.$http.post(this.$api.xkUserUpdateReferralCode,{'referralCode':this.code}, true).then((res) => {
                        this.$loading.close();
                        // console.log('是否有安全码',res);
                        let userInfo=JSON.parse(getUserInfo());
                        userInfo.securityCode=res.referralCode;
                        saveUserInfo(userInfo);
                        this.setInfo(userInfo);
                        this.$router.push('/xkCoinRecharge'); //返回晓可币充值中心
                    }).catch((err) => {
                        this.$loading.close();
                        this.$notify(err.message);
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .codeVerificate{
        height: 100vh;
        background: #f6f6f6;
        padding: 20px 10px;
        .title{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #777777;
            line-height: 12px;
            margin-bottom: 20px;
            text-align: left;
        }
        .inputInfo{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #777777;
        }
        .bottomInfo{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #4A90FA;
            line-height: 12px;
            margin-top: 10px;
            margin-bottom: 20px;
            text-align: left;
        }
    }
</style>