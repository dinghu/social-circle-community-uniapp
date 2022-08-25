<template>
	<view>
		<!-- 	<view class="read-tips">
			<text @click="readStatus">标记已读</text>
		</view> -->
		<block v-for="(item,index) in msgList" :key="index">
			<view class="comment-msg-item u-col-center" @click="updateMessageStatus(item)">
				<navigator :url="'/pages/user/home?uid='+ item.fromUid" hover-class="none">
					<u-avatar class="avatar" :src="item.fromUserAvatar"></u-avatar>
				</navigator>
				<view class="msg-c u-m-l-16">
					<view class="msg-c-t">
						<view class="u-m-b-20 u-flex">
							<text class="username u-m-r-12">{{item.fromUserName}}</text>
							<text class="u-font-24">关注了你</text>
							<text v-if="item.status === 0" class="dot"></text>
						</view>
						<text class="time">{{item.createTime | timeFrom}}</text>
					</view>
				</view>
			</view>
		</block>
		<!-- 加载状态 -->
		<block v-if="loadStatus != 'none'">
			<block v-if="msgList.length === 0 && loadStatus == 'nomore'">
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
		data() {
			return {
				msgType: 5,
				msgList: [],
				page: 1,
				loadStatus: "loadmore"
			};
		},
		onLoad(options) {
			this.getMsgList();
		},
		onReachBottom() {
			this.page++;
			this.getMsgList();
		},
		methods: {
			updateMessageStatus(item) {
				this.$H.post("app/message/updateMessageStatus/" + item.id).then(res => {
					item.status = 1;
				})
			},
			getMsgList() {
				this.$H.get("app/message/list", {
					msgType: this.msgType,
					page: this.page
				}).then(res => {
					this.msgList = this.msgList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},
			readStatus() {
				let that = this;
				this.$H.get("message/status", {
					msgType: this.msgType
				}).then(res => {
					this.msgList.forEach(function(item, index) {
						that.msgList[index].status = 1;
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-msg-item {
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		padding: 20rpx;
	}

	.comment-msg-item .msg-c {
		width: 100%;
	}

	.comment-msg-item .avatar {
		margin-right: 10rpx;
	}

	.comment-msg-item .post-c {
		background-color: #F8F8F8;
		margin-top: 16rpx;
		padding: 20rpx;
		font-size: 24rpx;
		line-height: 1.8;
		border-radius: 10rpx;
	}

	.comment-msg-item .post-c .post-c-txt {
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}

	.comment-msg-item .msg-c {
		display: flex;
		flex-direction: column;
	}

	.comment-msg-item .msg-c .msg-c-t {
		display: flex;
	}

	.comment-msg-item .msg-c .msg-c-t .time {
		font-size: 10px;
		color: #999;
		margin-left: auto;
	}

	.comment-msg-item .msg-c .username {
		// margin-bottom: 20rpx;
		font-size: 30rpx;
		// color: #2B85E4;
		color: $u-main-color;
	}

	.comment-msg-item .msg-c .msg-c-txt {
		display: flex;
		align-items: center;
	}

	.dot {
		width: 13rpx;
		height: 13rpx;
		background-color: #FA3534;
		border-radius: 50%;
		display: block;
		margin-left: 20rpx;
	}

	/*标记已读*/
	.read-tips {
		padding: 20rpx;
		background-color: #f5f5f5;
		display: flex;
	}

	.read-tips text {
		margin-left: auto;
	}
</style>
