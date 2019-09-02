<template>
    <transition name="fade">
        <div v-if="isShow" class="loadings-mock">
            <div class="zdy-loading">
                <van-loading
                        style="margin: 10px"
                        :vertical="vertical"
                        :text-size="textSize"
                        :size="size"
                        :color="color"
                        :type="type">
                </van-loading>
                <span :style="{'color': color,'font-size':textSize}">{{message}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
    import {Loading} from 'vant'

    export default {
        name: "Loading",
        components: {
            "van-loading": Loading
        },
        data() {
            return {
                isShow: false,
                color: "#ffffff",
                type: "circular",  //spinner
                size: "30px",
                textSize: "14px",
                vertical: true,
                message: ""
            }
        },
        methods: {
            /**
             * 显示动画loading
             */
            show(options = {}) {
                if (options.color) this.color = options.color;
                if (options.type) this.type = options.type;
                if (options.size) this.size = options.size;
                if (options.textSize) this.textSize = options.textSize;
                if (options.vertical) this.vertical = options.vertical;
                if (options.message) this.message = options.message;

                this.isShow = true
            },
            /**
             * 隐藏动画loading
             */
            hide() {
                this.isShow = false
            },
        },
    }
</script>

<style>
    .zdy-loading {
        min-width: 80px;
        min-height: 80px;
        max-width: 120px;
        padding: 20px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .loadings-mock {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>