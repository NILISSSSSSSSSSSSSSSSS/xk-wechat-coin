// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './util/filters'
import './assets/scss/index.scss'
import axios from './axios/index'
import service from './service/index'
import XkLoading from "./components/loading";

import {getUserInfo,saveGuid,saveUserInfo,getMerchantUserInfo,saveMerchantUserInfo} from '@/util/publicMehotds'
Vue.config.productionTip = false
import { Lazyload ,Notify ,Toast,List,Loading,PasswordInput,NumberKeyboard  } from 'vant';
// options 为可选参数，无则不传
Vue.use(Lazyload);
Vue.use(Notify);
Vue.use(Toast);
Vue.use(List);
Vue.use(Loading);
Vue.use(PasswordInput);
Vue.use(NumberKeyboard);
Vue.use(XkLoading);

Vue.prototype.$http = axios;
Vue.prototype.$api = service;
Vue.prototype.$notify = Notify;
Vue.prototype.$toast = Toast;

router.beforeEach(function (to, from, next) {
    document.title = to.meta.title || '晓可币充值中心';

    if(to.path == '/accontVerification'||to.path == '/merchantXkCoinRecharge'){
      if(to.path == '/merchantXkCoinRecharge'){
         if(getMerchantUserInfo('xk_coin_merchant')){
             next();
         }else {
             next('/accontVerification')
         }
      }else {
          next();
      }
    }else {
        let userInfo = getUserInfo('xk_coin_user') ? JSON.parse(getUserInfo('xk_coin_user')) : sessionStorage.getItem('mixinInfo')?JSON.parse(sessionStorage.getItem('mixinInfo')):{};
        if (to.path == '/login' || to.path == '/' || to.path == '/bindAccount' || to.path == '/register' || to.path == '/agreement'|| to.path == '/securityCodeVerificate') {
            if((to.path == '/bindAccount' || to.path == '/register') && !userInfo.openid){
                next('/login');
            }else if(to.path == '/bindAccount' && userInfo.isRegister == 1){
                next('/xkCoinRecharge')
            }else {
                next();
            }
        } else {
            // next();
            if (!userInfo.isRegister) {
                next('/login');
            }
            else if(!userInfo.securityCode){
                next('/securityCodeVerificate');
            }
            else {
                saveUserInfo(userInfo);
                next();
            }
        }
    }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
