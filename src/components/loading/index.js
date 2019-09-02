import Loading from "./Loading";

export default {
    /**
     * 每个插件都有的install方法，用于安装插件
     * @param {Object} Vue - Vue类
     * @param {Object} [pluginOptions] - 插件安装配置
     * @param {Object} [loading]
     */
    install(Vue, pluginOptions = {}, loading = null) {
        // 创建"子类"方便挂载
        const VueLoading = Vue.extend(Loading);

        /**
         * 初始化并显示loading
         * @returns {Promise} Promise实例
         */
        function $loading(options) {
            return new Promise(resolve => {
                // 第一次调用
                if (!loading) {
                    loading = new VueLoading();
                    // 手动创建一个未挂载的实例
                    loading.$mount();
                    // 挂载
                    document.querySelector(pluginOptions.container || "body").appendChild(loading.$el);
                }
                // 显示loading
                loading.show(options);
                resolve();
            });
        }

        // 定义关闭loading方法
        $loading.close = (noAnimate = false) => {
            return new Promise(resolve => {
                if (!loading || !loading.isShow) {
                    resolve();
                    return;
                }

                loading.hide();
            });
        };

        Vue.prototype.$loading = $loading;
    }
};
