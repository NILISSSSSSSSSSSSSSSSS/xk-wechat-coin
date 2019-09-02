import {appid} from '../util/publicParams'
import {queryParam, getUserInfo, saveUserInfo} from '../util/publicMehotds'
import http from '../axios/index'
import service from '../service/index';
import { Dialog } from 'vant';
import wx from 'weixin-jsapi'
import {mapState,mapMutations} from "vuex"
export default {

    data() {
        return {
            code: queryParam("code"),
            // code: queryParam("code") || "011g4AgL1njuP61aSPdL1vxGgL1g4AgJ"
        }
    },
    created() {
        //检测是否登录   未登录在App.vue中走登录流程
    },
    computed: {
        ...mapState({
            wx_game_info:state=>state.wx_game_info
        })
    },
    methods: {
        ...mapMutations({
            setInfo:'setInfo'
        }),
        signIn() {
            // console.log('code',this.code);

            if (!this.code) {
                let url = window.location.href;
                // let code = "snsapi_base";
                let scope = "snsapi_userinfo";
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect";
            } else {
                // 根据code 获取openid  并检测改用户是否注册  已注册直接登录  未注册走绑定晓可账号流程
                http.get(service.xkUserGzhLogin,{
                    code:this.code
                },true).then(res=>{
                    // saveUserInfo(res);
                    sessionStorage.setItem('mixinInfo',JSON.stringify(res));
                    this.setInfo(res);
                    if(!res.isRegister){
                        const url = `${location.protocol}//${location.host}/coin/#/bindAccount`;
                        window.location.replace(url);
                        // this.$router.push('/bindAccount')
                    }else{
                        const url = `${location.protocol}//${location.host}/coin/#/xkCoinRecharge`;
                        window.location.replace(url);
                    }
                })
                .catch(err=>{
                    this.$notify(err.message)
                })
            }
        },
    }
}