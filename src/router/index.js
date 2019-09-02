// import Vue from 'vue'
// import Router from 'vue-router'
// import bindAccount from '../views/bindAccount.vue'

// Vue.use(Router)

export default new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component:()=> import(/* webpackChunkName: "login" */ '../views/login.vue'),
            meta: {
                title: "晓可币充值中心"
            }
        },
        {
            path: '/',
            name: 'login',
            component:()=> import(/* webpackChunkName: "login" */ '../views/login.vue'),
            meta: {
                title: "晓可币充值中心"
            }
        },
        {
            path: '/bindAccount',
            name: 'bindAccount',
            component:()=> import(/* webpackChunkName: "login" */ '../views/bindAccount.vue'),
            meta: {
                title: "绑定晓可账号"
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import(/* webpackChunkName: "register" */ '../views/register.vue'),
            meta: {
                title: "注册晓可广场账号"
            }
        },
        {
            path: '/agreement',
            name: 'agreement',
            component: () => import(/* webpackChunkName: "agreement" */ '../views/agreement.vue'),
            meta: {
                title: "协议"
            }
        },
        {
            path: '/regSuccess',
            name: 'regSuccess',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/regSuccess.vue'),
            meta: {
                title: "注册成功"
            }
        },


        {
            path: '/setPayPassword',
            name: 'setPayPassword',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/setPayPassword.vue'),
            meta: {
                title: "设置支付密码"
            }
        },
        {
            path: '/xkCoinRecharge',
            name: 'xkCoinRecharge',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/xkCoinRecharge.vue'),
            meta: {
                title: "晓可币充值"
            }
        },
        {
            path: '/verifyPhone',
            name: 'verifyPhone',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/verifyPhone.vue'),
            meta: {
                title: "验证手机号"
            }
        },
        {
            path: '/isRechargeSucc',
            name: 'isRechargeSucc',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/isRechargeSucc.vue'),
            meta: {
                title: "充值成功"
            }
        },
        {
            path: '/isRechargeFail',
            name: 'isRechargeFail',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/isRechargeFail.vue'),
            meta: {
                title: "充值失败"
            }
        },
        {
            path: '/securityCodeVerificate',
            name: 'securityCodeVerificate',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/securityCodeVerificate.vue'),
            meta: {
                title: "完善信息"
            }
        },

        // 商户充值路由
        {
            path: '/merchantXkCoinRecharge',
            name: 'merchantXkCoinRecharge',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/merchant/merchantXkCoinRecharge.vue'),
            meta: {
                title: "联盟商充值晓可币"
            }
        },
        {
            path: '/accontVerification',
            name: 'accontVerification',
            component: () => import(/* webpackChunkName: "regSuccess" */ '../views/merchant/accontVerification.vue'),
            meta: {
                title: "验证联盟商帐号"
            }
        },
    ]
})
