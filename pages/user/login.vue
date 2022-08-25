<template>
	<view class="login">
		<image class="logo" :src="shareCover"></image>
		<text class="txt1">申请获取以下权限</text>
		<text class="txt2">获取你的公开信息（昵称、头像等）</text>
		<q-button @click="login">授权登录</q-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				domain: this.$H.domain,
				shareCover: "",
				code: ''
			};
		},
		onLoad() {
			this.getSysInfo();
			this.getLoginCode();
		},
		methods: {
			getSysInfo() {
				// this.$H.get("system/miniConfig").then(res => {
				// 	this.shareCover = res.result.intro;
				// })
			},
			async login() {

				uni.showLoading({
					mask: true,
					title: '登录中'
				});

				let that = this;
				let userserProfile = await this.getUserProfile();
				let loginCode = this.code
				if (!loginCode) {
					loginCode = await this.getLoginCode();
				}

				let userInfo = userserProfile.userInfo

				that.$H.post('app/miniWxLogin', {
					code: loginCode,
					signature: encodeURIComponent(userserProfile.signature),
					rawData: encodeURIComponent(userserProfile.rawData),
					encryptedData: encodeURIComponent(userserProfile.encryptedData),
					iv: encodeURIComponent(userserProfile.iv),
					username: userInfo.nickName,
					avatar: userInfo.avatarUrl,
					province: userInfo.province,
					city: userInfo.city,
					gender: userInfo.gender
				}).then(res2 => {
					if (res2.code === 200 || res2.code === 0) {
						// uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.data.token);
						// uni.navigateBack();
						that.getUserInfo();
						// uni.hideLoading();
					} else {
						uni.hideLoading();
					}
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					uni.setStorageSync("userInfo", res.result)
				})
			},
			getUserInfo() {
				this.$H.get("app/user/info/me").then(res => {
					console.log(res)
					uni.hideLoading();
					if (res.code === 0) {
						uni.setStorageSync("userInfo", res.data)
						uni.setStorageSync("hasLogin", true);
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
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							console.log(JSON.stringify(loginRes))
							this.code = loginRes.code
							resolve(loginRes.code);
						}
					});
				});
			},
			getUserProfile() {
				return new Promise((resolve, reject) => {
					wx.getUserProfile({
						lang: 'zh_CN',
						desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: res => {
							console.log(JSON.stringify(res))
							resolve(res);
						}
					});
				});
			}

		}
	}
</script>

<style lang="scss">
	.login {
		display: flex;
		flex-direction: column;
		padding: 100rpx;
	}

	.login .logo {
		width: 230rpx;
		height: 230rpx;
		margin: 50rpx auto;
	}

	.login .txt1 {
		margin-bottom: 10rpx;
	}

	.login .txt2 {
		color: #999;
		margin-bottom: 50rpx;
	}
</style>
