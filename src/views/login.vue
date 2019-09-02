<template>
    <div class='login'>
        <!--<p>微信必须同意</p>-->
        <!--<van-button type="info" @click="fnAgain">重新获取微信授权</van-button>-->
    </div>
</template>
<script>
    import {getUserInfo, saveUserInfo, clearWxCatch} from '../util/publicMehotds'
    import {appid} from '../util/publicParams'
    import wechatMixin from '../mixins/wechatMixin'

    export default {
        data() {
            return {

            }
        },
        mixins: [wechatMixin],
        created() {

        },
        mounted(){
                //检测是否登录
                if (!getUserInfo()) {
                    //用户信息为空 换取微信code
                    this.signIn()
                } else {
                    //已经注册登录过  获取openid 重新登录
                    let userInfo = JSON.parse(getUserInfo());
                    if (!userInfo.isRegister) {
                        const url = `${location.protocol}//${location.host}/coin/#/bindAccount`;
                        window.location.replace(url);
                    } else {
                        {
                            this.$http.post(this.$api.xkUserGzhOpenidLogin, {
                                uid: userInfo.id,
                                openid: userInfo.openid
                            }, true)
                                .then(res => {
                                    saveUserInfo(res);
                                    const url = `${location.protocol}//${location.host}/coin/#/xkCoinRecharge`;
                                    window.location.replace(url);
                                })
                                .catch(err => {
                                    if (err.code === 1014) {
                                        clearWxCatch(true);
                                        this.signIn()
                                    }
                                    this.$notify(err.message);
                                    console.log(err)
                                })
                        }
                    }
                }
        },
        methods: {
            fnAgain() {
                let url = window.location.href;
                let scope = "snsapi_userinfo";
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect";
            },
        }
    }
</script>
<style scoped lang="scss">
    .login-loading {
        position: absolute;
        width: 60px;
        height: 60px;
        background-color: rgba(0, 0, 0, .5);
        border-radius: 3px;
        top: 50%;
        margin-top: -30px;
        left: 50%;
        margin-left: -30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>