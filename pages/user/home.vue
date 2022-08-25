<template>
	<view class="u-skeleton">
		<view style="position: absolute;">
			<u-navbar :custom-back="onBack" back-icon-color="#fff" :background="background" :border-bottom="false">
			</u-navbar>
		</view>
		<image class="head-bg u-skeleton-rect" src="https://i.huim.com/miaoquan/623735791460.jpg"></image>
		<view class="con-c">
			<view class="user-info">
				<!-- <image class="avatar" :src="userInfo.avatar"></image> -->
				<u-avatar class="avatar" :src="userInfo.avatar" :show-level='userInfo.type == 1'
					level-bg-color="#8072f3" size="130"></u-avatar>
				<view class="user-c">
					<view class="username u-skeleton-fillet">{{userInfo.nickName}}</view>
					<view class="num-box u-skeleton-fillet">
						<text>{{userInfo.followNum}} <text class="txt">关注</text></text>
						<text>{{userInfo.fansNum}} <text class="txt">粉丝</text></text>
						<!-- <text>Lv.1</text> -->
					</view>
					<text class="desc u-skeleton-fillet">{{userInfo.intro}}</text>
					<view class="btn-box u-skeleton-fillet">
						<u-button v-if="userInfo.isFollow!=1" @click="follow" :custom-style="btnStyle" class="btn"
							shape="circle" size="mini">
							<u-icon name="plus"></u-icon>
							<text>关注</text>
						</u-button>
						<u-button v-else @click="cancelFollow" :custom-style="btnStyle2" class="btn" shape="circle"
							size="mini">
							<text>已关注</text>
						</u-button>
						<u-button @click="toChat" :custom-style="btnStyle2" shape="circle" size="mini">
							<text style="margin: 0 15rpx;">私信</text>
						</u-button>
					</view>
				</view>
			</view>
			<!-- tab -->
			<view class="tab-box u-skeleton-fillet">
				<u-tabs bg-color="#f5f5f5" inactive-color="#999" name="tab_name" :list="tabs" active-color="#616161"
					:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			</view>
			<!-- 主页 -->
			<view v-show="current === 0">
				<!-- 基本信息 -->
				<view class="f-wrap u-skeleton-fillet">
					<view class="title">基本信息</view>
					<view class="info-c">
						<view v-if="userInfo.type === 1" class="level-box">
							<view class="level">
								<u-icon name="level"></u-icon>
							</view>
							<text>云圈官方账号</text>
						</view>
						<text>性别：{{userInfo.sex==1?'男':'女'}}</text>
						<text>地区：{{userInfo.province}} {{userInfo.city}}</text>
						<text>个人简介：{{userInfo.userSign || userInfo.intro}}</text>
					</view>
				</view>
				<!-- 创建的圈子 -->
				<view v-if="userInfo.create_topic_list&&userInfo.create_topic_list.length > 0"
					class="f-wrap u-skeleton-fillet">
					<view class="title">创建的圈子</view>
					<topic-list :list="userInfo.create_topic_list" loadStatus="none"></topic-list>
				</view>
				<!-- 个人标签 -->
				<view class="f-wrap u-skeleton-fillet">
					<view class="title">标签</view>
					<view class="tag-box">
						<view v-for="(item,index) in userInfo.tag_str" :key="index" class="tag">{{item}}</view>
					</view>
				</view>
			</view>
			<!-- 帖子 -->
			<view v-show="current === 1">
				<post-list :list="postList" :loadStatus="loadStatus"></post-list>
			</view>
			<!-- 加入的圈子 -->
			<view v-show="current === 2">
				<topic-list :list="topicList"></topic-list>
			</view>
		</view>
		<!--骨架屏-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	import topicList from '../../components/topic-list/topic-list.vue';
	export default {
		components: {
			postList,
			topicList
		},
		data() {
			return {
				loading: true,
				btnStyle: {
					color: "#fff",
					backgroundColor: '#efd234'
				},
				btnStyle2: {
					border: '1px solid #efd234',
					color: "#efd234"
				},
				background: {
					backgroundColor: 'unset'
				},
				tabs: [{
						tab_name: '主页'
					}, {
						tab_name: '帖子'
					},
					{
						tab_name: 'TA的圈子'
					}
				],
				current: 0,
				uid: 0,
				postList: [],
				topicList: [],
				userInfo: {},
				userJson: "",
				loadStatus: "loading",
				page: 1
			};
		},
		onLoad(options) {
			this.uid = options.uid;
			this.getUserInfo();
		},
		onReachBottom() {
			if (this.current == 1) {
				this.page++;
				this.getPostList();
			}
		},
		methods: {
			toChat() {
				this.$H.get("app/message/private/letter/getConversationId", {
					toUserId: this.userInfo.userId
				}).then(res => {
					if (res.code === 200 || res.code === 0) {
						let url = '/pages/chat/chat?conversationId=' + res.data + '&user=' + this.userJson
						uni.navigateTo({
							url: url
						})
					} else {
						this.$u.toast(res.msg);
					}
				})
			},
			onBack() {
				uni.navigateBack();
			},
			follow() {
				this.$H.post('app/user/follow/' + this.userInfo.userId).then(res => {
					if (res.code === 200 || res.code === 0) {
						this.userInfo.isFollow = 1;
					} else {
						this.$u.toast(res.msg);
					}
				})
			},
			cancelFollow() {
				this.$H.post('app/user/follow/' + this.userInfo.userId).then(res => {
					if (res.code === 200 || res.code === 0) {
						this.userInfo.isFollow = 0;
					}
				})
			},
			tabChange(index) {
				this.current = index;
				if (index === 1) {
					this.getPostList();
				}
				if (index === 2) {
					this.getTopicList();
				}
			},
			getPostList() {
				this.loadStatus = "loading";
				this.$H.get('app/post/listPage', {
					page: this.page,
					userId: this.uid
				}).then(res => {
					this.postList = this.postList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},
			getTopicList() {
				this.$H.get('app/forum/listJoinForumByUserId', {
					userId: this.uid
				}).then(res => {
					this.topicList = res.data;
				})
			},
			getUserInfo() {
				this.$H.get('app/user/info/' + this.uid, {}).then(res => {
					//图片转换
					if (res.data.tags) {
						res.data.tag_str = res.data.tags.split(",")
					}
					this.userInfo = res.data;
					this.userJson = JSON.stringify(this.userInfo)
					uni.setNavigationBarTitle({
						title: this.userInfo.nickNmae
					});

					this.loading = false;
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.f-wrap {
		margin-bottom: 30rpx;
	}

	.head-bg {
		width: 100%;
		height: 500rpx;
	}

	.con-c {
		padding: 30rpx;
		position: relative;
		top: -200rpx;
		width: 100%;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		height: 450rpx;
	}

	.avatar {
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		border: 2px solid #FFFFFF;
		z-index: 999;
	}

	.user-info .user-c {
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding: 30rpx;
		position: absolute;
		top: 70rpx;
		width: 100%;
		box-shadow: 5rpx 10rpx 20rpx #e6e6e6;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-info .user-c .username {
		font-size: 40rpx;
		font-weight: bold;
		margin-top: 70rpx;
	}

	.user-info .user-c .num-box {
		font-size: 24rpx;
		margin: 20rpx 0;
		text-align: center;
	}

	.user-info .user-c .num-box .txt {
		color: #999;
		margin-left: 5rpx;
	}

	.user-info .user-c .num-box text {
		margin-right: 30rpx;
	}

	.user-info .user-c .desc {
		font-size: 22rpx;
		color: #999;
	}

	.user-info .user-c .btn-box {
		margin-top: 20rpx;
	}

	.user-info .user-c .btn-box .btn {
		margin-right: 20rpx;
	}

	.tab-box {
		// margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.info-c {
		display: flex;
		flex-direction: column;
	}

	.info-c>text {
		margin-bottom: 20rpx;
		color: #999;
	}

	.info-c .level-box {
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		color: #999;

		.level {
			font-size: 20rpx;
			color: #fff;
			padding: 5rpx 10rpx;
			background-color: $themes-color;
			border-radius: 10rpx;
			margin-right: 10rpx;
		}
	}

	/* 标签 */
	.tag-box {}

	.tag-box .tag {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: inline-block;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: #ffebe5;
	}

	.tag-box .tag:nth-child(2n) {
		background-color: #ecf9f2;
	}

	.tag-box .tag:nth-child(3n) {
		background-color: #fff7e5;
	}

	.tag-box .tag:nth-child(5n) {
		background-color: #b3e0ff;
	}
</style>
