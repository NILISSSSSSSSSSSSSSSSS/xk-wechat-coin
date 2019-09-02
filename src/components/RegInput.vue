<template>
	<div class="reg-input">
		<input v-model="inputValue" :placeholder="placeholder" :type="type"/>
		<transition name="fade">
			<div class="error" v-if="error.status">{{error.value}}</div>
		</transition>
		<div class="reg-foot">
			<slot name="foot"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'regInput',
		props: {
			value: {},
			placeholder: {},
			error:{
				type:Object,
				default:{}
			},
			type:{
				default:'text'
			}
		},
		data() {
			return {
				inputValue:""
			}
		},
		computed: {
			// inputValue(){
			// 	return JSON.parse(JSON.stringify(this.value))
			// }
		},
		created() {
		},
		methods: {},
		watch: {
			inputValue(val) {
				console.log(val)
				this.$emit('input', val);
			},
			value(val){
				this.inputValue = val
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
	.reg-input {
		width: 100%;
		height: 59.5px;
		position: relative;
		input{
			width: 100%;
			height: 40px;
			border: 0;
			outline: none;
			border-bottom: 0.1px solid #BCBCBC;
			box-sizing: border-box;
			font-size: 14px;
			-webkit-appearance : none ;  /*解决iphone safari上的圆角问题*/
			border-radius:0
		}
		.error{
			color:#f44336;
			text-align: left;
			height: 19px;
			line-height: 19px;
			font-size: 12px;
		}
		.reg-foot{
			position: absolute;
			right: 0;
			top: 0;
			height: 40px;
			line-height: 40px;
			font-size: 14px
		}
	}
</style>