<template>
	<view>
		<view class="head">
			<block v-if="hasLogin">
				<view class="userinfo" @click="toUcenter">
					<u-avatar :src="userInfo.avatar"></u-avatar>
					<view class="username u-m-l-20">
						<text>{{ userInfo.nickName }}</text>
						<text class="sub-txt">{{ userInfo.intro || '暂无签名' }}</text>
					</view>
					<q-icon class="arrow-right" name="q-arrow-right"></q-icon>
				</view>
			</block>
			<block v-else>
				<view class="btn-login">
					<!-- #ifdef MP-WEIXIN -->
					<u-button type="default" shape="circle" @click="toLogin" plain>登录</u-button>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<u-button type="default" shape="circle" @click="jumpPhoneLogin" plain>登录</u-button>
					<!-- #endif -->
				</view>
			</block>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/my/fans">
					<text>{{ userInfo.fansNum || 0}}</text>
					<view class="grid-text">粉丝</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/follow">
					<text>{{ userInfo.followNum || 0}}</text>
					<view class="grid-text">关注</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/post">
					<text>{{ userInfo.postNum || 0}}</text>
					<view class="grid-text">帖子</view>
				</u-grid-item>
				<u-grid-item>
					<text>{{ userInfo.integralNum || 0}}</text>
					<view class="grid-text">积分</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 我的服务 -->
		<view class="block-wrap">
			<view class="block-title">我的服务</view>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/my/discuss">
					<image class="gn-icon" src="/static/m_1.png"></image>
					<view class="grid-text">我的话题</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/topic">
					<image class="gn-icon" src="/static/m_2.png"></image>
					<view class="grid-text">我的圈子</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/post">
					<image class="gn-icon" src="/static/m_3.png"></image>
					<view class="grid-text">我的帖子</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/thumb">
					<image class="gn-icon" src="/static/m_4.png"></image>
					<view class="grid-text">点赞的帖子</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/collect">
					<image class="gn-icon" src="/static/m_3.png"></image>
					<view class="grid-text">我的收藏</view>
				</u-grid-item>

				<u-grid-item>
					<button open-type="contact" class="u-reset-button">
						<image class="gn-icon" style="margin-bottom: unset;" src="/static/m_8.png"></image>
						<view class="grid-text">帮助与反馈</view>
					</button>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- tabbar -->
		<!-- <q-tabbar :active="4" :count="msgCount"></q-tabbar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mAd: this.$c.mAd,
				userInfo: '',
				hasLogin: false
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum
			}
		},
		onLoad() {
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onShow() {
			if (uni.getStorageSync('hasLogin')) {
				this.getUserInfo();
				this.hasLogin = true;
			} else {
				this.hasLogin = false;
			}
			this.getMsgNum();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			let imgURL = 'https://oss.ymeoo.cn/logo.png';
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: imgURL
			};
		},
		methods: {
			getMsgNum() {
				this.$H.post('app/message/messageNum').then(res => {
					if (res.code == 200 || res.code == 0) {
						let totalCount = res.data.commentCount + res.data.followCount + res.data.zanCount
						this.$store.state.messegeNum = [0, 0, 0, totalCount, 0];
						if (totalCount > 0) {
							uni.setTabBarBadge({
								index: 2,
								text: totalCount + ''
							})
						} else {
							uni.removeTabBarBadge({
								index: 2
							})
						}
					} else {
						this.$store.state.messegeNum = [0, 0, 0, 0, 0];
						uni.removeTabBarBadge({
							index: 2
						})
					}
				});
			},
			jumpPhoneLogin() {
				uni.navigateTo({
					url: '/pages/user/sms-login'
				});
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			getUserInfo() {
				this.$H.get("app/user/info/me").then(res => {
					console.log(res)
					this.userInfo = res.data;
				})
			},
			toUcenter() {
				uni.navigateTo({
					url: '/pages/user/edit-info/edit'
				});
			},
			toNav(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	};
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.head {
		padding: 20rpx;
		background-color: #fff;

		.sub-txt {
			font-size: 24rpx;
			color: #999999;
			display: block;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}

		margin-bottom: 20rpx;
	}

	.userinfo {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.userinfo .username {
		display: flex;
		flex-direction: column;
	}

	.grid-text {
		color: #999;
		font-size: 12px;
		margin-bottom: 20rpx;
	}

	.userinfo u-avatar {
		margin-right: 20rpx;
	}

	.userinfo .arrow-right {
		margin-left: auto;
	}

	.btn-login {
		margin: 40rpx 0;
	}

	.gn-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
	}

	/*服务按钮*/
	.btn-wrap {
		display: flex;
		margin-top: 30rpx;
	}

	.btn-wrap .btn-contact {
		background-color: #fff;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding: 20rpx;
		line-height: unset;
		font-size: 12px;
		color: #999;
	}

	.btn-wrap .btn-contact:active {
		background-color: #f5f5f5;
	}

	.btn-wrap .btn-contact .txt {
		margin-top: 20rpx;
	}

	.btn-wrap .btn-contact::after {
		border: unset;
		position: unset;
	}

	.icon-size {
		font-size: 50rpx;
	}

	.block-wrap {
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		overflow: hidden;

		.block-title {
			background-color: #fff;
			padding: 20rpx;
		}
	}
</style>
