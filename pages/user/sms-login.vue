<template>
	<view class="container">
		<view class="head">登录后更精彩</view>
		<u-form :model="form" ref="uForm">
			<u-form-item>
				<u-input v-model="form.mobile" placeholder="请输入手机号" type="number" :maxLength="11" />
			</u-form-item>

			<u-form-item>
				<u-input v-model="form.password" placeholder="请输入密码" type="password" :maxLength="20"
					:passwordIcon="false" />
			</u-form-item>

			<!-- <u-form-item>
				<u-input v-model="form.code" placeholder="请输入验证码" />
				<u-button slot="right" size="mini" @click="getCode">{{tips}}</u-button>
				<u-verification-code :seconds="60" @end="end" @start="start" ref="uCode" @change="codeChange">
				</u-verification-code>
			</u-form-item> -->
		</u-form>
		<view class="marin-top-100">
			<!-- 	<u-button v-show="form.mobile && form.password" type="success" @click="phoneLogin" shape="circle">登录
			</u-button>
			<u-button v-show="!form.mobile || !form.password" type="default" shape="circle">登录</u-button> -->

			<q-button @click="phoneLogin" shape="circle">登录</q-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					mobile: "18080064363",
					password: '18080064363',
					code: ""
				},
				tips: '验证码',
				targetUrl: '',
			};
		},
		onLoad(options) {
			if (options.targetUrl) {
				this.targetUrl = options.targetUrl
			}
		},
		methods: {
			getUserInfo(loginRes) {
				this.$H.get("app/user/info/me").then(res => {
					console.log(res)
					uni.hideLoading();
					if (res.code === 0) {
						uni.setStorageSync("userInfo", res.data)
						uni.setStorageSync("hasLogin", true);
						// uni.setStorageSync("token", loginRes.data.token);
						if (this.targetUrl) {
							uni.redirectTo({
								url: this.targetUrl
							})
						} else {
							uni.navigateBack();
						}
					}
				})
			},
			phoneLogin() {
				uni.showLoading({
					mask: true,
					title: '登录中'
				});
				this.$H.post("app/login", this.form).then(res => {
					if (res.code == 200 || res.code == 0 || res.code == 0) {
						uni.setStorageSync("token", res.data.token);
						this.getUserInfo(res);
					} else {
						uni.hideLoading();
					}
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})

					this.$H.post("user/sendSmsCode", {
						mobile: this.form.mobile
					}).then(res => {
						if (res.code == 200 || res.code == 0) {
							uni.hideLoading();
							this.$refs.uCode.start();
						}
					})
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx 50rpx;
	}

	.marin-top-100 {
		margin-top: 100rpx;
	}

	.head {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 50rpx;
	}
</style>
