<template>
	<view>
		<block v-for="(item, index) in list" :key="index">
			<navigator :url="'/pages/user/home?uid=' + item.userId" class="member-item">
				<u-avatar class="avatar" :src="item.avatar"></u-avatar>
				<view class="user u-flex-1">
					<text class="name">{{ item.nickName }}</text>
					<!-- <text v-if="item.sex == 1" class="iconfont icon-nan"></text> -->
					<u-icon name="man" color="#2979ff" size="32" v-if="item.sex == 1"></u-icon>
					<u-icon name="woman" color="#FFB6C1" size="32" v-else></u-icon>
					<!-- <text v-else class="iconfont icon-nv"></text> -->
				</view>
				<u-button @click="follow(index, item.userId)" v-if="item.isFollow === 0" class="btn-gz" type="primary"
					size="mini" shape="circle" :custom-style="{color:'#333'}">关注</u-button>
				<u-button @click="cancelFollow(index, item.userId)" v-if="item.isFollow === 1" class="btn-gz"
					type="default" size="mini" plain shape="circle">已关注</u-button>
				<u-button @click="cancelFollow(index, item.userId)" v-if="item.isFollow === 2" class="btn-gz"
					type="default" size="mini" plain shape="circle">互相关注</u-button>
			</navigator>
		</block>
		<!-- 加载状态 -->
		<block v-if="loadStatus != 'none'">
			<block v-if="list.length === 0 && loadStatus == 'nomore'">
				<u-empty margin-top="100" text="暂无用户" mode="favor"></u-empty>
			</block>
			<block v-else>
				<u-loadmore margin-bottom="50" margin-top="50" :status="loadStatus" />
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array,
			loadStatus: String
		},
		data() {
			return {
				// userList: []
			};
		},
		watch: {
			// list() {
			// 	this.userList = this.list;
			// }
		},
		methods: {
			follow(index, uid) {
				this.$H.post('app/user/follow/' + uid).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.list[index].isFollow = res.data.isFollow;
					}
				});
			},
			cancelFollow(index, uid) {
				this.$H.post('app/user/follow/' + uid).then(res => {
					if (res.code === 200 || res.code == 0) {
						this.list[index].isFollow = res.data.isFollow;
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.member-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #f5f5f5;
		background-color: #ffffff;

		&:last-child {
			border-bottom: 0;
		}

	}

	.member-item .icon-nv {
		color: #ff4d94;
	}

	.member-item .icon-nan {
		color: #0091ff;
	}

	.member-item .avatar {
		margin-right: 20rpx;
	}

	.member-item .user .name {
		margin-right: 20rpx;
	}

	.member-item .user .iconfont {
		font-size: 12px;
	}

	.member-item .btn-gz {
		margin-left: auto;
	}
</style>
