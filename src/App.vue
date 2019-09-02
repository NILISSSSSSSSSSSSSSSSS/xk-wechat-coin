<template>
  <div id="app">
    <!--<div id="nav">-->
      <!--<router-link to="/">Home</router-link> |-->
      <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <router-view/>
  </div>
</template>

<script>
    import {clearWxCatch} from './util/publicMehotds'
    export default {
        data() {
            return {
            }
        },
        created() {
            clearWxCatch();
        },
        mounted() {
            this.disableIosResize();
        },
        methods:{
            // 禁止ios缩放
            disableIosResize() {
                document.addEventListener(
                    "touchstart",
                    function(event) {
                        if (event.touches.length > 1) {
                            event.preventDefault();
                        }
                    },
                    false
                );
                var lastTouchEnd = 0;
                document.addEventListener(
                    "touchend",
                    function(event) {
                        var now = new Date().getTime();
                        if (now - lastTouchEnd <= 300) {
                            event.preventDefault();
                        }
                        lastTouchEnd = now;
                    },
                    false
                );
                document.addEventListener(
                    "gesturestart",
                    function(event) {
                        event.preventDefault();
                    },
                    { passive: false }
                );
            }
        },
    }
</script>
<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
