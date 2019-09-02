<template>
    <div class = 'reg-fail'>
        <div class="pubCard">
            <div>
                <img src="../assets/images/failureRecharge.png" style="width: 66px;height: 66px;margin: 30px auto 20px auto"/>
            </div>
            <div style="font-size: 17px;color: #222222;letter-spacing: 1px; margin-bottom: 20px;">充值失敗</div>
            <button type="button" style="color: #4A90FA;  background: #fff;width: 98px;height: 30px;border: 1px solid #4A90FA;border-radius: 4px;margin-bottom: 20px;"
                    @click="rePayment">返回</button>
        </div>

    </div>
</template>
<script>
export default {
    name:'isRechargeFail',
    data () {
        return {

        };
    },
    props: {},
    components: {
    },
    mounted() {},
    methods: {
        rePayment(){
            this.$router.back(-1);
        }
    },
}
</script>
<style scoped lang="scss">
    .reg-fail{
        height: 100vh;
        background: #f6f6f6;
        padding: 20px 10px;
    }
    .pubCard {
        background: #FFFFFF;
        border-radius: 8px;
        width: 355px;
        margin:0 auto;
    }
</style>