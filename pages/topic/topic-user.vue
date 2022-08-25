<template>
	<view>
		<!-- navbar -->
		<u-navbar>
			<!-- tabs -->
			<view class="tab-box">
				<u-tabs :list="tabList" font-size="35" name="cate_name" bg-color="#fff" :current="current"
					@change="tabChange" activeColor="#f29100"></u-tabs>
			</view>
		</u-navbar>
		<view v-show="current === 0" style="background-color: #f5f5f5;">
			<!-- 基本信息 -->
			<view class="topic-info">
				<image class="cover" :src="topicInfo.image" mode="aspectFill"></image>
				<view class="right">
					<text class="topic-name">{{ topicInfo.name }}</text>
					<view class="count-box">
						<text>{{ topicInfo.post_count || 0}}动态</text>
						<text>{{ topicInfo.user_count || 0}}成员</text>
					</view>
				</view>
			</view>
			<!-- 简介 -->
			<view class="desc-box">
				<view class="title">圈子简介</view>
				<text class="desc">{{ topicInfo.content || '暂无简介' }}</text>
			</view>
		</view>
		<view v-show="current === 1" style="background-color: #f5f5f5;">
			<!-- 圈主 -->
			<view class="user-block" v-if="topicInfo.forumOwner">
				<view class="title">圈主</view>
				<user-list :list="[topicInfo.forumOwner]" loadStatus="none" key="1"></user-list>
			</view>
			<!-- 管理员 -->
			<view class="user-block" v-if="topicInfo.forumUserAdmins&&topicInfo.forumUserAdmins.length > 0">
				<view class="title">管理员</view>
				<user-list :list="topicInfo.forumUserAdmins" loadStatus="none" key="2"></user-list>
			</view>
			<!-- 圈友 -->
			<view class="user-block">
				<view class="title">圈友</view>
				<user-list :list="userList" :loadStatus="loadStatus" key="3"></user-list>
			</view>
		</view>
	</view>
</template>

<script>
	import userList from '../../components/user-list/user-list.vue';
	export default {
		components: {
			userList
		},
		data() {
			return {
				userList: [],
				page: 1,
				loadStatus: 'loadmore',
				topicId: '',
				topicInfo: {},
				tabList: [{
						name: '介绍'
					},
					{
						name: '成员'
					}
				],
				current: 0
			};
		},
		onLoad(options) {
			this.topicId = options.id;
			this.getUserList();
			this.getTopicInfo();
		},
		onReachBottom() {
			this.page++;
			this.getUserList();
		},
		methods: {
			getTopicInfo() {
				this.$H.get('app/forum/info/' + this.topicId + '?isMore=1')
					.then(res => {
						this.topicInfo = res.data;
						// console.log(JSON.stringify(this.topicInfo.forumUserAdmins ))
					});
			},
			tabChange(index) {
				this.current = index;
			},
			getUserList() {
				this.loadStatus = 'loading';
				this.$H.get('app/forum/forumUserList/' + this.topicId, {
					page: this.page
				}).then(res => {
					this.userList = this.userList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
			}
		}
	};
</script>
<style>
	page {
		/* background-color: #f5f5f5; */
	}
</style>
<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.tab-box {
		width: 100%;
		// margin-left: 40%;
		display: flex;
		justify-content: center;
	}

	.topic-info {
		display: flex;
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 30rpx;

		.cover {
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.topic-name {
				font-weight: 600;
			}

			.count-box {
				font-size: 24rpx;
				color: #999;

				text {
					margin-right: 20rpx;
				}
			}
		}
	}

	.desc-box {
		background-color: #fff;
		padding: 30rpx;
		min-height: 990rpx;

		.title {
			font-weight: 600;
			margin-bottom: 20rpx;
		}

		.desc {
			color: #616161;
			line-height: 1.8;
		}
	}

	.user-block {
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 20rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.title {
			font-weight: 600;
		}
	}
</style>
