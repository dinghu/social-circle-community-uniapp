<template>
	<view>
		<!-- navbar -->
		<u-navbar :is-back="false" z-index="98" :height="108">
			<view style="width: 100%;">
				<view class="search-wrap u-p-l-20 u-p-r-20  u-flex" style="height: 54px;width: 100%;">
					<view class="u-flex-1" style="height: 100%;line-height: 54px;" @click="toSearch">
						<u-search shape="round" placeholder="动态|圈子|用户" :disabled="true" :show-action="false"
							:height="76"></u-search>
					</view>
					<view class="u-m-l-20 u-m-r-4" @click="showPopup = true">
						<u-icon name="plus-circle-fill" color="#f29100" size="50" label="发布" labelPos="bottom"
							labelSize="24"></u-icon>
					</view>
				</view>
				<view style="height: 44px;width: 100%;">
					<u-tabs :list="tabList" font-size="35" name="cate_name" bg-color="#fff" :current="current"
						@change="tabChange" activeColor="#f29100"></u-tabs>
				</view>
			</view>
		</u-navbar>

		<!-- 关注 -->
		<view v-if="current === 0">
			<post-list :list="followUserPost" :loadStatus="loadStatus1"></post-list>
		</view>
		<view v-if="current === 1">
			<!-- 我的圈子 -->
			<view class="topic-wrap" v-if="hasLogin">
				<view class="block-title">
					<view>我的圈子</view>
				</view>
				<u-grid @click="jump" :col="5" :border="false">
					<!-- 我的圈子 -->
					<u-grid-item :index="'/pages/topic/detail?id='+item.id" v-for="(item, index) in joinTopicList"
						:key="index">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" :src="item.image">
							</u-image>
							<view class="name">{{ item.name.substring(0, 5) }}</view>
							<text v-if="sessionUid == item.createUserId" class="user">圈主</text>
						</view>
					</u-grid-item>
					<!-- 创建圈子 -->
					<u-grid-item @click="createForum">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" src="/static/add-2.png">
							</u-image>
							<view class="name">创建圈子</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<post-list :list="joinTopicPost" :loadStatus="loadStatus3"></post-list>
		</view>
		<!-- tabbar -->
		<!-- <q-tabbar :active="0" :count="msgCount"></q-tabbar> -->
		<!-- 返回顶部 -->
		<q-back-top></q-back-top>

		<!-- 中间按钮弹窗 -->
		<q-popup v-model="showPopup">
			<view class="handle-wrap">
				<view @click="handleJump(item)" class="item" v-for="(item,index) in popup" :key="index">
					<image mode="widthFix" class="icon" :src="item.icon"></image>
					<text class="txt">{{item.text}}</text>
				</view>
			</view>
			<view class="handle-close">
				<q-icon @click="onClose" size="50rpx" name="q-Close"></q-icon>
			</view>
		</q-popup>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	export default {
		components: {
			postList
		},
		data() {
			return {
				sessionUid: uni.getStorageSync('userInfo').userId,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				loadStatus3: 'loadmore',
				page: 1,
				page2: 1,
				page3: 1,
				shareCover: '',
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				tabList: [{
						name: '关注'
					},
					{
						name: '圈子动态'
					},
				],
				current: 1,
				joinTopicList: [],
				hasLogin: false,
				showPopup: false,
				popup: [{
						icon: '/static/h_2.png',
						text: '动态',
						url: '/pages/post/add?type=1'
					},
					{
						icon: '/static/h_3.png',
						text: '视频',
						url: '/pages/post/add?type=2'
					}
					// ,
					// {
					// 	icon: '/static/h_1.png',
					// 	text: '投票',
					// 	url: '/pages/vote/vote'
					// }
				]
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: this.shareCover
			};
		},
		onLoad() {
			this.getSysInfo();
			this.getFollowUserPost();
			this.getJoinTopicPost();
			this.getUserJoinTopic();
		},
		onShow() {
			this.getMsgNum();
			if (this.$appUtils.getToken()) {
				this.getUserJoinTopic();
			}
			if (uni.getStorageSync('hasLogin')) {
				this.hasLogin = true;
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.sessionUid = userInfo.userId
				}
			} else {
				this.sessionUid = ''
				this.hasLogin = false;
			}
		},
		onReachBottom() {
			if (this.current === 0) {
				this.page2++;
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page3++;
				this.getJoinTopicPost();
			}
		},
		onPullDownRefresh() {
			if (this.current === 0) {
				this.page2 = 1;
				this.followUserPost = [];
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page3 = 1;
				this.joinTopicPost = [];
				this.getJoinTopicPost();
				this.getUserJoinTopic();
			}
			uni.stopPullDownRefresh();
		},
		methods: {
			handleJump(e) {
				uni.navigateTo({
					url: e.url
				})
				this.showPopup = false;
			},
			onClose() {
				this.showPopup = false;
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			createForum(index) {
				this.$appUtils.loginAndGoto('/pages/topic/add/add')
			},
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
			tabChange(index) {
				this.current = index;
			},
			// 用户加入的圈子
			getUserJoinTopic() {
				this.loadStatus = 'loading';
				this.$H.post('app/forum/userJoinForum', {
					class_id: this.topicClassId
				}).then(res => {
					this.joinTopicList = res.data;
					uni.stopPullDownRefresh();
				});
			},
			jump(url) {
				uni.navigateTo({
					url: url
				})
			},
			getSysInfo() {
				// this.$H.get('system/miniConfig').then(res => {
				// 	this.shareCover = res.result.intro;
				// });
			},
			// 获取加入的圈子动态
			getJoinTopicPost() {
				this.loadStatus3 = 'loading';
				this.$H.get('app/post/joinForumPostList', {
					page: this.page3
				}).then(res => {
					//图片转换
					if (res.data.list) {
						res.data.list.forEach((item, index) => {
							if (item.imageUrls) {
								item.images = item.imageUrls.split(",")
							}
						})
					}

					this.joinTopicPost = this.joinTopicPost.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus3 = 'nomore';
					} else {
						this.loadStatus3 = 'loadmore';
					}
				});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				this.$H.get('app/post/followUserPostList', {
					page: this.page2
				}).then(res => {
					//图片转换
					if (res.data.list) {
						res.data.list.forEach((item, index) => {
							if (item.imageUrls) {
								item.images = item.imageUrls.split(",")
							}
						})
					}
					console.log(res.data.list)
					this.followUserPost = this.followUserPost.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus1 = 'nomore';
					} else {
						this.loadStatus1 = 'loadmore';
					}
				});
			},
		}
	};
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
	.search-wrap {
		flex: 1;
		// margin: 20rpx;
	}

	.swiper-body {
		height: calc(100vh - var(--status-bar-height) - 43px);
	}

	.body-scroll-view {
		width: 100%;
		height: 100%;
	}

	.tab-box {
		width: 80%;
	}

	.block-title {
		font-weight: bold;
		padding: 20rpx 10rpx;
		color: #333;
		display: flex;
		font-size: 32rpx;

		.right {
			margin-left: auto;
			color: #999;
			font-size: 24rpx;
		}
	}

	// 顶部圈子
	.topic-wrap {
		padding: 0 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.grid-topic {
		position: relative;
		margin-bottom: 20rpx;

		.name {
			font-size: 24rpx;
			text-align: center;
		}

		.user {
			position: absolute;
			left: 0;
			top: 0;
			font-size: 20rpx;
			display: block;
			background-color: $themes-color;
			padding: 5rpx;
			border-radius: 10rpx 0 10rpx 0;
		}
	}


	// 中间按钮弹出框
	.handle-wrap {
		display: flex;
		padding: 50rpx 0;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 1;
			padding: 20rpx 0;
			border-radius: 20rpx;

			.icon {
				width: 100rpx;
				margin-bottom: 20rpx;
			}

			.txt {
				font-size: 28rpx;
			}
		}
	}

	.handle-close {
		display: flex;
		justify-content: center;
		margin-bottom: 50rpx;
	}
</style>
