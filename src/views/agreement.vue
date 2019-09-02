<template>
    <div class = 'agreement'>
        <div class="agreement-pop" v-html="agreementContent" v-if="agreementContent"></div>
        <div class="agreement-pop-loading" v-else>
            <van-loading  color="#666" type="spinner"/>
        </div>
    </div>
</template>
<script>
    import {getUserInfo,getMerchantUserInfo,saveMerchantUserInfo} from '../util/publicMehotds'
export default {
    name:'agreement',
    data () {
        return {
            agreementContent:'',
            contractConfigKey:'',
            userInfo:{},
        };
    },
    props: {},
    components: {},
    mounted() {
        this.userInfo = getMerchantUserInfo() ? JSON.parse(getMerchantUserInfo()) : {};
        this.agreementDetail();
    },
    methods: {
        agreementDetail(){
            let contractConfigKey = this.$route.query.contractConfigKey;
            this.agreementContent = '';
            this.$http.get(this.$api.platformPtotocolConfigDetail,{
                contractConfigKey,
                forPlatform:this.userInfo.token?"mam":"ua",
            } , false).then((res) => {
                this.agreementContent = res.content ;
            }).catch((err) => {
                this.agreementContent = '';
                this.$notify(err.message);
            });
        }
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.agreement{
    width: 100vw;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    background: #f6f6f6;
    text-align: left;
    .agreement-pop{
        width: 100%;
        height: 100%;
        padding: 15px;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: 10px;
        background: #fff;
        border-radius: 6px;
    }
    .agreement-pop-loading{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 6px;
    }
}
</style>