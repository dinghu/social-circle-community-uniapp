<template>
	<view>
		<block v-for="(item, index) in list" :key="item.id">
			<view @click="jump(item)">
				<view class="post-item">
					<view class="post-item-top-user">
						<view @click.stop="toUcenter(item.createUid)">
							<u-avatar class="avatar" :src="item.createUserAvatar" :show-level='item.createUserType == 1'
								level-bg-color="#8072f3" :size="80"></u-avatar>
						</view>
						<view class="center">
							<view style="display: flex;align-items: center;">
								<text v-if="item.createUserType == 1" class="official">官方</text>
								<text class="username">{{ item.createUserName.substring(0, 12) }}</text>
							</view>
							<view class="time u-font-24">
								<text>{{ item.createTime | timeFrom }}</text>
							</view>
						</view>
						<view class="right" @click.stop="onActive(item, index)">
							<u-icon v-if="handle && sessionUid == uid" class="arrow-down" size="40"
								name="more-dot-fill"></u-icon>
							<u-icon v-else-if="admin" class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							<u-icon v-else-if="sessionUid == item.createUid" class="arrow-down" size="40"
								name="more-dot-fill"></u-icon>
						</view>
					</view>
					<text class="discuss-title" :data-id="item.discuss_id" v-if="item.discuss_id > 0"
						@tap.stop="toDiscuss">#{{ item.discuss_title }}</text>
					<view v-if="item.title" style="width: 100%;" class="post-content">
						<view class="u-flex u-col-top">
							<!-- 无图片 -->
							<view class="u-flex-1" v-if="!item.images || item.images.length == 0">
								<!-- <view class="u-font-32 color-333">{{item.title}}</view> -->
								<view class="u-font-26 color-666 u-line-2 u-m-t-12">{{item.shortContent}}</view>
								<!-- <view class="u-font-26 color-666 u-line-2 u-m-t-12 " v-html="item.shortContent"/> -->
							</view>
							<view class="u-flex-1" v-else>
								<view class="u-font-32 color-333">{{item.title}}</view>
								<view class="u-font-26 color-666 u-line-2 u-m-t-12">{{item.shortContent}}</view>
								<!-- <view class="u-font-26 color-666 u-line-2 u-m-t-12 u-line-3" v-html="item.shortContent"/> -->
							</view>
							<view v-if="item.images&&item.images.length == 1" style="width: 200rpx;height: 150rpx;"
								class="u-m-l-20">
								<image :lazy-load="true" mode="aspectFill"
									style="width: 100%;height: 100%;border-radius: 10rpx;" :src="item.images[0]"
									@tap.stop="previewImage(item.images[0], item.images)">
								</image>
							</view>
						</view>
						<!--二张图片-->
						<view v-if="item.images&&item.images.length == 2" class="u-m-t-20">
							<view class="img-style-2">
								<image :lazy-load="true" v-for="(imageItem, index2) in item.images" :key="index2"
									@tap.stop="previewImage(imageItem, item.images)" mode="aspectFill" :src="imageItem">
								</image>
							</view>
						</view>
						<!--三张以上图片-->
						<view v-else-if="item.images&&item.images.length > 2" class="u-m-t-20">
							<view class="img-style-3">
								<image :lazy-load="true" v-for="(imageItem, index2) in item.images" :key="index2"
									@tap.stop="previewImage(imageItem, item.images)" mode="aspectFill" :src="imageItem">
								</image>
							</view>
						</view>
					</view>
					<view class="post-content" v-else>
						<!-- <rich-text class="post-text u-m-b-20 u-line-3" :nodes="item.shortContent"></rich-text> -->
						<view class="post-text u-m-b-20 u-line-3">{{item.shortContent}}</view>
						<!-- 帖子类型 -->
						<block v-if="(item.type == 0 || item.type == 1) &&item.images">
							<view>
								<!--一张图片-->
								<block v-if="item.images.length == 1">
									<image :lazy-load="true" mode="aspectFill" class="img-style-1" :src="item.images[0]"
										@tap.stop="previewImage(item.images[0], item.images)"></image>
								</block>
								<!--二张图片-->
								<block v-if="item.images.length == 2">
									<view class="img-style-2">
										<image :lazy-load="true" v-for="(imageItem, index2) in item.images"
											:key="index2" @tap.stop="previewImage(imageItem, item.images)"
											mode="aspectFill" :src="imageItem"></image>
									</view>
								</block>
								<!--三张以上图片-->
								<block v-if="item.images.length > 2">
									<view class="img-style-3">
										<image :lazy-load="true" v-for="(imageItem, index2) in item.images"
											:key="index2" @tap.stop="previewImage(imageItem, item.images)"
											mode="aspectFill" :src="imageItem"></image>
									</view>
								</block>
							</view>
						</block>
						<!-- 视频 -->
						<view class="video-wrap" v-if="item.type == 2 && item.videoUrl.length > 0">
							<image class="icon" src="/static/play.png"></image>
							<image mode="aspectFill" :src="item.headImage"
								style="width: 100%;border-radius: 10rpx;height: 100%;" v-if="item.headImage" />
							<image mode="aspectFill" :src="item.videoUrl + '?x-oss-process=video/snapshot,t_0,f_jpg'"
								style="width: 100%;border-radius: 10rpx;height: 100%;" v-else>
							</image>
							<!-- <video :show-center-play-btn="false" :controls="false" :src="item.media[0]"></video> -->
						</view>
					</view>
					<!-- 投票 -->
					<view v-if="item.type === 4" class="vote-box">
						<view class="title">{{item.vote_info.title}}</view>
						<view class="expire-time">截止：{{item.vote_info.expire_time | date('yyyy年mm月dd日hh时MM分')}}</view>
						<view class="vote-item" v-for="(item2,index2) in item.vote_info.options" :key="index2">
							{{item2.content}}
						</view>
					</view>
					<!-- 位置 -->
					<view class="address" v-if="item.address">
						<u-icon class="icon" name="map-fill"></u-icon>
						<text>{{ item.address }}</text>
					</view>
					<!-- 底部 -->
					<view class="p-footer">
						<view class="p-item">
							<button @click.stop="onShare" class="u-reset-button" open-type="share">
								<u-icon name="zhuanfa"></u-icon>
								<text class="count">分享</text>
							</button>
						</view>
						<view class="p-item margin50">
							<text class="iconfont icon-pinglun u-font-34"></text>
							<text class="count">{{ item.commentNum || 0}}</text>
						</view>
						<view v-if="item.isZan" class="p-item" @click.stop="cancelCollection(item.id,index)">
							<u-icon name="heart-fill" color="#cc0000"></u-icon>
							<text class="count">{{ item.zanNum || 0}}</text>
						</view>
						<view v-else @click.stop="addCollection(item.id,index)" class="p-item">
							<u-icon name="heart"></u-icon>
							<text class="count">{{ item.zanNum || 0}}</text>
						</view>

						<!-- 	<view v-show="item.isCollection" class="p-item" @click.stop="cancelCollection(item.id,index)">
							<u-icon name="heart-fill" color="#cc0000"></u-icon>
							<text class="count">{{ item.collectNum || 0}}</text>
						</view>
						<view v-show="!item.isCollection" class="p-item" @click.stop="addCollection(item.id,index)">
							<u-icon name="heart"></u-icon>
							<text class="count">{{ item.collectNum || 0}}</text>
						</view> -->
					</view>

					<view class="hot-comment" v-if="item.hotComments&&item.hotComments.length>0">
						<view v-for="(item,index) in item.hotComments" class="u-flex u-font-24">
							<text class="u-font-bold">{{item.userName}}:</text>{{item.content}}
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 操作弹窗 -->
		<u-action-sheet :list="actionListTarget" v-model="showAction" @click="actionCon"></u-action-sheet>
		<!-- 加载状态 -->
		<block v-if="list.length === 0 && loadStatus == 'nomore'">
			<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore :status="loadStatus" />
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'post-list',
		props: {
			list: Array,
			loadStatus: String,
			handle: {
				default: false,
				type: Boolean
			},
			showTopic: {
				default: true,
				type: Boolean
			},
			uid: Number,
			admin: {
				default: false,
				type: Boolean
			}
		},
		data() {
			return {
				showAction: false,
				indexPostAd: this.$c.indexPostAd,
				actionList: [{
						text: '关注作者',
						key: 'follow'
					},
					{
						text: '删除',
						color: 'red',
						key: 'delete'
					}
				],
				actionListNoFollow: [{
					text: '删除',
					color: 'red',
					key: 'delete'
				}],
				actionListTarget: [],
				choosePost: '',
				chooseIndex: '',
				sessionUid: ''
			};
		},
		watch: {
			uid(n) {
				if (this.sessionUid == n) {
					this.actionList.unshift({
						text: '置顶',
						key: 'top'
					});
					this.actionListNoFollow.unshift({
						text: '置顶',
						key: 'top'
					});
				}
			}
		},
		created() {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.sessionUid = userInfo.userId;
			}
		},
		methods: {
			onShare() {},
			onActive(postInfo, index) {
				console.log('--------onActive------------')
				if (this.sessionUid == postInfo.createUid) {
					this.actionListTarget = this.actionListNoFollow
				} else {
					this.actionListTarget = this.actionList
				}
				this.showAction = true;
				this.choosePost = postInfo;
				this.chooseIndex = index;
			},
			actionCon(index) {
				let key = this.actionListTarget[index].key;
				if (key == 'follow') {
					this.follow();
				}

				if (key == 'delete') {
					this.postDelPop();
				}

				if (key == 'top') {
					this.postTop();
				}
			},
			cancelCollection(id, index) {
				this.$H.post('app/post/zan/' + id).then(res => {
					if (res.code === 200 || res.code === 0) {
						this.list[index].isZan = 0;
						this.list[index].zanNum;
					}
				});
			},
			addCollection(id, index) {
				this.$H.post('app/post/zan/' + id)
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.list[index].isZan = 1;
							this.list[index].zanNum++;
						}
					});
			},
			// 置顶帖子
			postTop() {
				this.$H.post('app/post/setTop/' + this.choosePost.id).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.$q.toast('成功设为置顶', 'success');
					}
				});
			},
			postDelPop() {
				uni.showModal({
					title: '确定删除帖子吗？删除后将无法恢复',
					success: (res) => {
						if (res.confirm) {
							this.postDel()
						}
					}
				})
			},
			postDel() {
				this.$H.post('app/post/delete', {
					id: this.choosePost.id
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.list.splice(this.chooseIndex, 1);
					}
				});
			},
			follow() {
				this.$H.post('app/user/follow/' + this.choosePost.createUid)
					.then(res => {
						this.$u.toast(res.msg);
					});
			},
			previewImage(url, urls) {
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				});
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/topic/detail?id=' + id
				});
			},
			jump(e) {
				let url;
				// 图文
				if (e.type == 1 || e.type == 4 || e.type == 0) {
					url = '/pages/post/detail?id=' + e.id;
				}

				//视频
				else if (e.type == 2) {
					// url = '/pages/video/index?id=' + e.id
					url = '/pages/post/video-detail?id=' + e.id;
				}

				uni.navigateTo({
					url: url
				});
			},
			toDiscuss(e) {
				uni.navigateTo({
					url: '/pages/discuss/detail?id=' + e.currentTarget.dataset.id
				});
			},
			toUcenter(uid) {
				let userId = uni.getStorageSync("userInfo")?.userId
				if (userId == uid) {
					uni.switchTab({
						url: "/pages/my/my"
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/home?uid=' + uid
					});
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	.hot-comment {
		margin-top: 20rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;
		padding: 16rpx 10rpx;
	}

	.post-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.post-content {
			margin-top: 20rpx;

			.img-style-1 {
				display: block;
				width: 100%;
				max-height: 600rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}

			.img-style-2 {
				display: flex;

				image {
					margin: 5rpx;
					border-radius: 10rpx;
					width: 100%;
					height: 240rpx;
				}
			}

			.img-style-3 {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 31.3%;
					height: 200rpx;
					margin: 1%;
					border-radius: 10rpx;
				}
			}
		}

		.address {
			display: flex;
			font-size: 20rpx;
			background-color: #F5F5F5;
			border-radius: 20rpx;
			display: inline-block;
			padding: 5rpx 20rpx;
			margin: 20rpx 0;

			.icon {
				margin-right: 5rpx;
			}
		}
	}

	.post-item-top-user {
		display: flex;
		align-items: center;

		.avatar {
			width: 85rpx;
			height: 85rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #999;

			.username {
				font-size: 28rpx;
				font-weight: bold;
				color: #121212;
			}

			.official {
				display: inline-block;
				font-size: 20rpx;
				color: #000;
				background-color: $themes-color;
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				margin-right: 10rpx;
			}
		}

		.right {
			height: 85rpx;

			.arrow-down {
				color: #999;
			}
		}
	}

	.post-text {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		white-space: pre-wrap;
		overflow: hidden;
		font-size: 32rpx;
		color: #121212;
	}

	.discuss-title {
		height: 30rpx;
		padding: 10rpx;
		line-height: 30rpx;
		border-radius: 20rpx;
		font-size: 12px;
		background: #f0f0f5;
		color: #68c778;
		text-align: center;
	}

	.p-footer {
		display: flex;
		margin: 20rpx 0 0 0;

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

	.comment-wrap {
		font-size: 28rpx;
		padding-top: 20rpx;
		border-top: 1px solid #F5F5F5;

		.item {
			.name {
				color: #000;
				font-weight: 600;
			}
		}
	}

	.video-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 400rpx;

		.icon {
			width: 100rpx;
			height: 100rpx;
			z-index: 999;
		}

		image {
			position: absolute;
		}
	}

	// 投票
	.vote-box {
		background-color: #F5F5F5;
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
</style>
