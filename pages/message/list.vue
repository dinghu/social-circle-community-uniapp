<template>
	<view>
		<!-- 	<view class="read-tips">
			<text @click="readStatus">标记已读</text>
		</view> -->
		<block v-for="(item,index) in msgList" :key="index">
			<view class="comment-msg-item">
				<navigator :url="'/pages/user/home?uid='+ item.fromUid" hover-class="none">
					<u-avatar class="avatar" :src="item.fromUserAvatar"></u-avatar>
				</navigator>
				<view class="msg-c u-m-l-16">
					<view class="msg-c-t">
						<view class="u-m-b-20">
							<text class="username u-m-r-12">{{item.fromUserName}}</text>
							<text class="u-font-24" v-if="item.msgType == 1">评论了</text>
							<text class="u-font-24" v-else-if="item.msgType == 2">点赞了</text>
							<text class="u-font-24" v-else-if="item.msgType == 5">关注了你</text>
						</view>
						<text class="time">{{item.createTime | timeFrom}}</text>
					</view>
					<view class="msg-c-txt" v-if="msgType != 2">
						<text class="u-font-30">{{item.messagePayLoad.content}}</text>
						<text v-if="item.status === 0" class="dot"></text>
					</view>
					<navigator v-if="msgType != 5" :url="'/pages/post/detail?id='+item.post_id" hover-class="none">
						<view class="post-c">
							<view class="post-c-txt">{{item.content}}</view>
						</view>
					</navigator>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgType: 0,
				msgList: []
			};
		},
		onLoad(options) {
			this.msgType = options.type;
			this.getMsgList();
		},
		methods: {
			getMsgList() {
				this.$H.get("app/message/list", {
					msgType: this.msgType
				}).then(res => {
					this.msgList = res.data.list;
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
		background-color: #eee;
		margin-top: 20rpx;
		padding: 20rpx;
		font-size: 12px;
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
		color: #2B85E4;
	}

	.comment-msg-item .msg-c .msg-c-txt {
		display: flex;
		align-items: center;
	}

	.comment-msg-item .msg-c .msg-c-txt .dot {
		width: 10rpx;
		height: 10rpx;
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
