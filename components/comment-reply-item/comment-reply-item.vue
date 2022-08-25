<template>
	<view class="u-flex u-col-top replay">
		<image :src="reply.userAvatar || reply.avatar" class="replay_avatar" @click.stop="goUserCenter(reply.userId)"
			mode="aspectFill" />
		<!-- <u-avatar class="avatar" :src="reply.userAvatar" level-bg-color="#8072f3" :size="66"></u-avatar> -->
		<view class="u-flex-1 u-m-l-24">
			<view class="u-flex u-row-between u-col-top">
				<view class="u-flex">
					<text class="replay_name" @click.stop="goUserCenter(reply.userId)">{{reply.userName}}</text>
					<!-- <text class="replay-author u-m-l-8">作者</text> -->
				</view>
				<view class="u-flex" @click="zanClick">
					<text class="u-font-26 u-m-r-10" style="color: #999999;">{{reply.zanNum || 0}}</text>
					<!-- <image :src="reply.avatar_url" class="replay-avatar" /> -->
					<!-- <image :src="/static/images/icon_me_like.png" class="replay_like u-m-l-16" /> -->
					<!-- 		<image
						:src="reply.isZan&&reply.isZan == 1?'/static/images/icon_me_like_a.png':'/static/images/icon_me_like.png'"
						class="replay_like u-m-l-16" /> -->
					<u-icon class="icon" size="34" name="heart-fill" color="#e62e00"
						v-if="reply.isZan&&reply.isZan == 1"></u-icon>
					<u-icon class="icon" size="34" name="heart-fill" color="#bfbfbf" v-else></u-icon>
				</view>
			</view>
			<view :class="reply.toReplyContent&&reply.toReplyUserName?'u-m-t-20':'u-m-t-20'" @click="replyClick">
				<text class="u-font-30 u-m-t-6 replay_content auto-line">{{reply.content}}</text>
			</view>
			<view class="u-m-t-20 replay_p_content" v-if="reply.toReplyContent&&reply.toReplyUserName">
				<text >@{{reply.toReplyUserName}}：{{reply.toReplyContent}}</text>
			</view>

			<view class="u-flex u-row-between u-m-t-20">
				<view class="u-flex">
					<text class="replay_time">{{reply.createTime | timeFrom}}</text>
					<text class="replay_replay_to u-m-l-30" @click="replyClick">回复</text>
				</view>

				<text class="u-font-24" style="color: #AAAAAA;" @click="deleteClick" v-if="reply.canDel == 1">删除</text>
			</view>

			<u-gap height="1" bg-color="#EEEEEE" :marginTop="16"></u-gap>

		</view>
	</view>
</template>

<script>
	import $appUtils from '@/utils/app-utils.js'
	export default {
		props: {
			reply: {
				type: Object,
				default () {
					return {}
				}
			},
			posIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			goUserCenter(userId) {
				$appUtils.goUserCenter(userId)
			},
			setZanStatus(iszan) {
				this.reply.iszan = iszan
			},
			zanClick() {
				this.$emit('zanClick', this.posIndex)
			},
			replyClick() {
				this.$emit('replyClick', this.reply)
			},
			deleteClick() {
				this.$emit('deleteClick', this.posIndex)
			}

		}
	}
</script>

<style lang="scss">
	.replay_avatar {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
	}

	.replay_name {
		font-size: 30rpx;
		font-weight: bold;
		color: #121212;
	}

	.replay {
		// padding: 30rpx 28rpx 30rpx 40rpx;
		padding: 30rpx 30rpx 30rpx 30rpx;
	}

	.replay_like {
		width: 35rpx;
		height: 29rpx;
	}

	.replay_p_content {
		// width: 567rpx;
		width: 100%;
		background: #F8F8F8;
		border-radius: 6rpx;
		padding: 10rpx 16rpx;
		font-size: 32rpx;
		color: #555555;
	}

	.replay_content {
		font-size: 32rpx;
		color: #121212;
	}

	.replay_replay_to {
		// width: 102rpx;
		// height: 42rpx;
		// background: #F8F8F8;
		// border-radius: 20rpx;
		// line-height: 42rpx;
		text-align: center;
		font-size: 24rpx;
	}

	.replay_time {
		font-size: 24rpx;
		color: #939393;
	}

	// .replay {
	// 	padding: 30rpx 28rpx 30rpx 40rpx;

	// 	&_avatar {
	// 		width: 66rpx;
	// 		height: 66rpx;
	// 		border-radius: 50%;
	// 	}

	// 	&_name {
	// 		font-size: 30rpx;
	// 		font-weight: bold;
	// 		color: #121212;
	// 	}

	// 	&_like {
	// 		width: 35rpx;
	// 		height: 29rpx;
	// 	}

	// 	&_p_content {
	// 		width: 567rpx;
	// 		background: #F8F8F8;
	// 		border-radius: 3rpx;
	// 		font-size: 32rpx;
	// 		color: #555555;
	// 	}

	// 	&_content {
	// 		font-size: 32rpx;
	// 		color: #121212;
	// 	}

	// 	&_replay_to {
	// 		width: 102rpx;
	// 		height: 42rpx;
	// 		background: #F8F8F8;
	// 		border-radius: 20rpx;
	// 		line-height: 42rpx;
	// 		text-align: center;
	// 	}

	// 	&_time {
	// 		font-size: 24rpx;
	// 		color: #939393;
	// 	}

	// }
</style>
