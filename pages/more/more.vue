<template>
	<view>
		<!-- navbar -->
		<!-- 	<u-navbar :is-back="false" :border-bottom="false">
			<view class="search-wrap" @click="toSearch">
				<u-search shape="round" placeholder="动态|圈子|用户" :disabled="true" :show-action="false"></u-search>
			</view>
		</u-navbar> -->
		<!-- 轮播图 -->
		<view class="swiper-box">
			<u-swiper @click="onSwiper" :list="swiperList" name="image" border-radius="20" mode="rect"></u-swiper>
		</view>
		<!-- 热门圈子 -->
		<view class="u-flex u-row-between">
			<view class="block-title">热门圈子</view>

			<view class="u-flex u-m-r-30">
				<view @click="$u.route('/pages/topic/class-list')" class="color-999">全部圈子</view>
				<u-icon class="arrow-down" size="30" name="arrow-right" color="#999"></u-icon>
			</view>

		</view>
		<view class="hot-topic">
			<navigator hover-class="none" :url="'/pages/topic/detail?id=' + item.id" class="topic-item"
				v-for="(item, index) in topicHotList" :key="index">
				<view class="topic-index">{{index+1}}</view>
				<image :src="item.image" class="cover-img" mode="aspectFill"></image>
				<view class="footer">
					<text>{{ item.name }}</text>
					<text class="user-num">{{item.joinNum || 0}} 圈友</text>
				</view>
			</navigator>
		</view>
		<!-- tabs -->
		<u-tabs :list="classList" name="cate_name" bg-color="#fff" :current="current" @change="tabChange"
			activeColor="#f29100"></u-tabs>

		<post-list :list="postList" :loadStatus="loadStatus"></post-list>

		<!-- tabbar -->
		<!-- <q-tabbar :active="1" :count="msgCount"></q-tabbar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				classList: [],
				classId: '',
				topicList: [],
				loadStatus: 'loadmore',
				current: 0,
				topDisList: [],
				swiperList: [],
				postList: [],
				topicHotList: []
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum;
			}
		},
		onLoad() {
			this.getClassList();
			this.getDisTopic();
			this.getLinkList();
			this.getHotTopic();
		},
		onShow() {
			this.getMsgNum();
		},
		onReachBottom() {
			this.page++;
			this.getClassPost();
		},
		methods: {
			getHotTopic() {
				this.$H.get("app/forum/hot").then(res => {
					this.topicHotList = res.data;
				})
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/topic/detail?id=' + id
				});
			},
			previewImage(url, urls) {
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				});
			},
			// 获取分类下帖子列表
			getClassPost() {
				this.loadStatus = 'loading';
				this.$H.get('app/post/forumCatsPostList', {
					forumCateId: this.classId,
					page: this.page
				}).then(res => {
					//图片转换
					if (res.data.list) {
						res.data.list.forEach((item, index) => {
							if (item.imageUrls) {
								item.images = item.imageUrls.split(",")
							}
						})
					}
					this.postList = this.postList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
			},
			// 处理点击轮播图跳转
			onSwiper(index) {
				let url = this.swiperList[index].url;
				if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: '/pages/webview/webview?src=' + url
					});
				}
			},
			// 获取推荐话题
			getDisTopic() {
				this.$H.get('app/topic/hot', {
					order: 'hot'
				}).then(res => {
					this.topDisList = res.data;
				});
			},
			// 获取轮播图
			getLinkList() {
				this.$H.post('app/home/getBanners', {}).then(res => {
					this.swiperList = res.data;
				});
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
			getClassList() {
				let that = this;
				this.$H.get('app/forum/forumCates').then(res => {
					this.classList = res.data;
					if (this.classId) {
						this.classList.forEach((item, index) => {
							if (item.id == that.classId) {
								this.classId = this.classList[index].id;
								this.swichMenu(index);
							}
						});
					} else {
						this.classId = this.classList[0].id;
						this.getClassPost();
					}
				});
			},
			tabChange(index) {
				this.page = 1;
				this.current = index;
				this.classId = this.classList[index].id;
				this.postList = [];
				this.getClassPost();
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.search-wrap {
		flex: 1;
		margin: 20rpx;
	}

	.swiper-box {
		padding: 20rpx;
	}

	// 热门圈子
	.hot-topic {
		padding: 20rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 20rpx;

		.topic-item {
			box-shadow: 10rpx 10rpx 20rpx #F5F5F5;
			position: relative;
			overflow: hidden;
			border-radius: 10rpx;

			.topic-index {
				position: absolute;
				top: 0;
				left: 0;
				background-color: $themes-color;
				padding: 0 20rpx;
				border-radius: 10rpx 0 20rpx 0;
				z-index: 10;
			}

			.cover-img {
				width: 100%;
				height: 200rpx;
				border-radius: 10rpx 10rpx 0 0;
			}

			.footer {
				padding: 20rpx;
				font-size: 24rpx;
				display: flex;

				.user-num {
					margin-left: auto;
					white-space: nowrap;
					color: #999;
				}
			}
		}
	}

	// 块标题
	.block-title {
		font-weight: bold;
		padding: 20rpx;
		color: #333;
		display: flex;
		font-size: 32rpx;

		.right {
			margin-left: auto;
			color: #999;
			font-size: 24rpx;
		}
	}

	// 帖子
	.post-item {
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-bottom: 1px solid #f5f5f5;

		.head {
			display: flex;

			.info {
				margin-left: 10rpx;

				.user {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #999;

					.username {
						margin-left: 10rpx;
					}
				}
			}

			.right {
				margin-left: auto;
				background-color: $themes-color;
				font-size: 24rpx;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 20rpx;
				border-radius: 10rpx;
			}
		}

		.post-content {
			margin-top: 20rpx;

			.video-wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				width: 100%;
				height: 500rpx;

				.icon {
					width: 100rpx;
					height: 100rpx;
					z-index: 999;
				}

				image {
					position: absolute;
					width: 100%;
					border-radius: 10rpx;
				}
			}

			.img-style-1 {
				display: block;
				width: 100%;
				max-height: 600rpx;
				border-radius: 5px;
				overflow: hidden;
			}

			.img-style-2 {
				display: flex;

				image {
					margin: 5rpx;
					border-radius: 5px;
					width: 100%;
					height: 294rpx;
				}
			}

			.img-style-3 {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 31.3%;
					height: 200rpx;
					margin: 1%;
					border-radius: 5px;
				}
			}
		}

		.address {
			display: flex;
			font-size: 20rpx;
			background-color: #f5f5f5;
			border-radius: 20rpx;
			display: inline-block;
			padding: 5rpx 20rpx;
			margin: 20rpx 0;

			.icon {
				margin-right: 5rpx;
			}
		}

		// 投票
		.vote-box {
			background-color: #f5f5f5;
			border-radius: 20rpx;
			padding: 20rpx;
			margin: 20rpx;

			.title {
				font-weight: bold;
			}

			.expire-time {
				font-size: 24rpx;
				margin: 20rpx 0;
			}

			.vote-item {
				font-size: 24rpx;
				font-weight: bold;
				padding: 20rpx;
				border-radius: 20rpx;
				border: 1px solid #999;
				text-align: center;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.p-footer {
			display: flex;
			margin: 20rpx 0;

			.p-item {
				margin: 0 auto;
				color: #616161;
				display: flex;
				align-items: center;

				.count {
					margin-left: 10rpx;
					font-size: 28rpx;
				}
			}

			.p-item[hidden] {
				display: none !important;
			}
		}
	}
</style>
