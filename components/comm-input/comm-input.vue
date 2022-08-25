<template>
	<view v-if="showInput" :style="{marginBottom:keyHeight+'px'}">
		<!-- #ifndef APP-NVUE -->
		<!-- <u-popup @close="close" @open="open" v-model="showInput" mask-close-able :border-radius="20" mode="bottom"> -->
		<!-- #endif -->
		<view class="u-m-l-18 u-flex" style="min-height: 166rpx;">
			<view class="common-textarea">
				<!-- <u--input placeholder="请输入内容" border="surround" v-model="value" @change="change"></u--input> -->
				<textarea v-model="value" type="textarea" :placeholder="placeholder" autoHeight
					class="common-textarea-input" :border="false" focus @focus="focusElve"
					placeholder-style="color:#686A78;fontSize:30rpx" :adjust-position="false" @blur="blurElve" auto-blur
					ref="input" placeholder-class="placeholder-style-class" :focus="isFocus" />
				<!-- <u--textarea v-model="value" placeholder="请输入内容" autoHeight class="common-textarea-input"
						border="none"></u--textarea> -->
			</view>
			<view class="u-m-l-18">
				<button class="send-button" @click="send"><text class="color-white">发送</text></button>
			</view>
		</view>
		<!-- #ifndef APP-NVUE -->
		<!-- </u-popup> -->
		<!-- #endif -->

	</view>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: '请输入内容'
			},
		},
		data() {
			return {
				showInput: true,
				value: '',
				// placeholder: '',
				keyHeight: 0,
				isFocus: false
			}
		},
		onLoad() {

		},
		methods: {
			keyboardheightchange() {
				this.keyHeight = e.detail.height;
			},
			blurElve(e) {
				this.keyHeight = 0;
				this.isFocus = false;
				// this.close()
				// #ifdef APP-NVUE
				this.$refs.input.blur()
				// #endif
			},
			focusElve(e) {
				this.keyHeight = e.detail.height;
				// uni.showModal({
				// 	content: JSON.stringify(e)
				// })
				console.log(JSON.stringify(e))
			},
			show() {
				this.showInput = true
				this.value = ''
				this.isFocus = true;
			},
			change(e) {
				console.log('change', e);
			},
			close() {
				this.keyHeight = 0;
				this.isFocus = false;
				// this.showInput = false
				this.value = ''
			},
			open() {
				this.show();
			},
			send() {
				if (!this.value) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				// this.showInput = false
				this.$emit('send', this.value)
				this.close()
			}
		}
	}
</script>

<style lang="scss">
	.placeholder-style-class {
		color: #686A78;
		fontSize: 30rpx
	}

	.common-textarea {
		/* width: 564rpx; */
		flex: 1;
		min-height: 84rpx !important;
		/* background-color: #ebeff1; */
		background: #F3F3F3;
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 42rpx;
		padding: 20rpx 20rpx;
	}

	.common-textarea-input {
		width: 100%;
		font-size: 32rpx;
		min-height: 44rpx !important;
	}

	.send-button {
		width: 160rpx;
		height: 80rpx;
		// background: linear-gradient(-30deg, $themes-color, $u-type-primary-dark);
		background: linear-gradient(to right, $themes-color, $u-type-primary-dark);
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #121212;
		margin-right: 20rpx;
	}

	.input {
		width: 564rpx;
		min-height: 83rpx;
		background: #F3F3F3;
		border-radius: 10rpx;
		font-size: 32px;
		color: #686A78;
		padding-left: 40rpx;
	}
</style>
