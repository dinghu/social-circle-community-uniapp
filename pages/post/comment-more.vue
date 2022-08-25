<template>
	<view v-if="showReply" class="maskRoot">
		<view class="u-flex-col" :style="replyStyle" style="background-color: #FFFFFF;height: 100%;">
			<view class="u-flex-1">
				<scroll-view scroll-y :scroll-top="scrollTop" @scroll="scroll" scroll-with-animation
					@scrolltolower="loadMore" :style="replyScrollStyle">
					<view class="u-flex u-col-top article">
						<image :src="comment.userAvatar" class="article_avatar"
							@click.stop="goUserCenter(comment.userId)" />
						<view class="u-flex-1 u-m-l-24">
							<view class="article_name" @click.stop="goUserCenter(comment.userId)">
								{{comment.userName}}
							</view>
							<view class="u-m-t-20">
								<text class="article_content auto-line">{{comment.content}}</text>

								<view class="post_info u-m-t-20 u-flex" v-if="comment.postInfo"
									@click="goPost(comment.postInfo)">
									<image :src="comment.postInfo.headImage"
										style="width: 70rpx;height: 70rpx;background-color: #AAAAAA;"
										v-if="comment.postInfo.headImage"></image>
									<image src="/static/m_3.png" style="width: 70rpx;height: 70rpx;" v-else></image>
									<view class="u-flex-1 u-m-l-16 u-line-2">
										{{comment.postInfo.createUserName}}:{{comment.postInfo.title}}
									</view>
								</view>
							</view>
							<view class="u-flex u-row-between u-m-t-20">
								<view class="article_time ">{{comment.postInfo.createTime | timeFrom}}</view>
								<text class="u-font-24" style="color: #AAAAAA;" @click.stop="deleteComment(comment)"
									v-if="comment.canDel == 1">删除</text>
							</view>
						</view>
					</view>

					<view>
						<u-gap height="1" bg-color="#eeeeee" :marginTop="30" :marginBottom="30"></u-gap>
					</view>

					<view class="u-font-30 color-black u-m-l-34 u-font-bold all-reply" id="all-reply">全部回复
					</view>

					<view v-for="(item,index) in replyList" :key="index">
						<comment-reply-item :reply="item" :key="index" @zanClick="zanCommentReply" :posIndex="index"
							@replyClick="replayCommentReply" @deleteClick="deleteCommentReplyShowModal"
							:ref="'commentReplyItem'+index">
						</comment-reply-item>
					</view>
					<u-loadmore :status="loadMoreStatus" line v-if="replyList.length>0" />
					<view style="height: 250rpx;"></view>
				</scroll-view>

			</view>
			<view class="footer u-flex" v-if="false">
				<view class="say-more u-m-l-30">
					<image src="/static/images/icon_detail_edit.png" style="width: 29rpx;height: 33rpx;" />
					<text class="u-font-28 u-m-l-24" style="color: #666666;" @click="replayComment">说点什么...</text>
				</view>
				<view class="u-flex u-m-l-20 u-row-between u-flex-1 u-m-r-14">
					<view class="u-flex" @click="commentzan">
						<image
							:src="comment.isZan==1?'/static/images/icon_detail_like_a.png':'/static/images/icon_detail_like.png' "
							style="width: 56rpx;height: 48rpx;" />
						<text class="u-m-l-10">{{comment.zanNum || 0}}</text>
					</view>
					<view class="u-flex" @click="commentReply">
						<image src="/static/images/icon_detail_replay.png" style="width: 54rpx;height: 54rpx;" />
						<text class="u-m-l-10">{{comment.replyNum || 0}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="commInputInner">
			<!-- 评论输入弹出层 -->
			<comm-input ref="commInputReply" @send="commSend" :placeholder="placeholder"></comm-input>
		</view>

		<u-modal v-model="showModal" content="确认删除评论?" :z-index="10090" show-cancel-button
			@confirm="deleteCommentReply">
		</u-modal>
	</view>
</template>

<script>
	const deviceInfo = uni.getSystemInfoSync()

	if (deviceInfo.brand == 'Xiaomi') {
		deviceInfo.windowHeight += 1
	}
	import $appUtils from '@/utils/app-utils.js'
	import CommentReplyItem from '@/components/comment-reply-item/comment-reply-item.vue'
	// 评论输入弹出层组件
	import CommInput from '@/components/comm-input/comm-input'
	export default {
		props: {},
		data() {
			return {
				placeholder: '请输入内容',
				showReply: true,
				comment: '',
				commentIndex: 0,
				replyList: [],
				replyAction: 1,
				to_reply: '',
				showModal: false,
				delPosition: '',
				scrollIntoView: '',
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				loadMoreStatus: 'loadmore',
				commentPage: 1,
				windowHeight: '',
				replyStyle: {
					width: "750rpx",
					height: ''
				},
				replyScrollStyle: {
					flex: 1,
					width: "750rpx",
					height: '' //,- uni.rpx2px(166)
				},
			}
		},
		onLoad(options) {
			if (options.commentId) {
				this.getComment(options.commentId)
			}
		},
		methods: {
			goPost(post) {
				$appUtils.goPost(post);
			},
			deleteComment(comment) {
				let that = this;
				let user = uni.getStorageSync('userInfo');
				if (comment.userId != user.userId) {
					this.$u.toast('没有操作权限')
					return;
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该评论吗？删除后将无法恢复',
					success: function(res) {
						if (res.confirm) {
							that.$H.post('app/post/comment/delete', {
								id: comment.id
							}).then(res2 => {
								that.$u.toast('评论已删除')
								$appUtils.navigateBackDelay(1000)
							});
						}
					}
				});
			},
			getComment(commentId) {
				this.$H.get('app/post/comment/info/' + commentId).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.open(res.data, 0, deviceInfo.windowHeight)
					}
				}).catch(err => {
					$appUtils.navigateBackDelay(1500)
				})
			},
			goUserCenter(userId) {
				$appUtils.goUserCenter(userId)
			},
			loadMore() {
				if (this.loadMoreStatus == 'nomore') {
					return
				}
				this.loadMoreStatus = 'loading';
				this.commentPage = ++this.commentPage;
				this.commentreplylist(this.commentPage);
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			commentzan() {
				this.$emit('commentzan', this.commentIndex)
			},
			commSend(value) {
				if (this.replyAction == 1) {
					let form = {
						content: value,
						commentId: this.comment.id
					}
					this.$H.post('app/post/comment/replay', form).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.replyList.unshift(res.data)
							// this.comment.replynum = res.reply_num
							this.comment.replyNum += 1
							this.$nextTick(() => {
								this.goTop();
								this.$emit('commentReplyNumChange', this.commentIndex, this.comment
									.replynum)
								this.$refs.commInputReply.close()
							})
						}
						uni.hideLoading();
					});
				} else if (this.replyAction == 2) {

					let form = {
						content: value,
						commentId: this.comment.id,
						toReplyId: this.to_reply.id,
						toReplyContent: this.to_reply.content,
						toReplyUid: this.to_reply.userId,
					}
					this.$H.post('app/post/comment/replay', form).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.replyList.unshift(res.data)
							// this.comment.replynum = res.reply_num
							this.comment.replyNum += 1
							this.$nextTick(() => {
								this.goTop();
								this.$refs.commInputReply.close()
							})
						}
						uni.hideLoading();
					});
				}
			},
			zanCommentReply(position) {
				let replyTmp = this.replyList[position]
				this.$H.post('app/post/comment/replay/zan/' + replyTmp.id).then(res => {
					if (res.code == 200 || res.code == 0) {
						if (replyTmp.isZan == 1) {
							replyTmp.isZan = 0;
							replyTmp.zanNum--;
						} else {
							replyTmp.isZan = 1;
							replyTmp.zanNum++;
						}
					}
					uni.hideLoading();
				});
			},
			deleteCommentReplyShowModal(position) {
				this.showModal = true;
				this.delPosition = position;
			},
			deleteCommentReply() {
				let replyTmp = this.replyList[this.delPosition]
				this.$H.post('app/post/comment/replay/delete', {
					id: replyTmp.id
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.$u.toast('评论已删除')
						this.replyList.splice(this.delPosition, 1)
						this.comment.replyNum -= 1
						this.$emit('commentReplyNumChange', this.commentIndex, this.comment.replynum)
					}
					uni.hideLoading();
				});
			},
			//回复评论的评论
			replayCommentReply(reply) {
				this.to_reply = reply
				this.replyAction = 2
				this.placeholder = '回复：  ' + reply.userName
				this.showInput()
			},
			//回复评论
			replayComment() {
				this.replyAction = 1
				this.placeholder = '请输入内容'
				this.showInput()
			},
			showInput() {
				this.$nextTick(() => {
					this.$refs.commInputReply.show()
				})
			},
			close() {
				this.showReply = false
				this.$emit('close')
			},
			open(comment, commentIndex, windowHeight) {
				this.windowHeight = windowHeight
				this.replyStyle.height = windowHeight + 'px'
				this.replyScrollStyle.height = windowHeight + 'px' //,- uni.rpx2px(166)
				this.showReply = true
				this.comment = comment
				this.commentIndex = commentIndex
				this.commentreplylist(1)
			},
			commentreplylist(pageNo) {
				this.$H.get('app/post/comment/replay/list', {
					postCommentId: this.comment.id,
					page: pageNo
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						if (pageNo == 1) {
							this.replyList = []
						}
						this.replyList = this.replyList.concat(res.data.list);
						if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
							this.loadMoreStatus = 'nomore';
						} else {
							this.loadMoreStatus = 'loadmore';
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	// .maskRoot {
	// 	position: fixed;
	// 	z-index: 1002;
	// 	left: 0;
	// 	bottom: 0;
	// 	top: 0;
	// 	width: 750rpx;
	// 	display: flex;
	// 	flex-direction: column;
	// 	justify-content: flex-end;
	// 	background-color: rgba(0, 0, 0, 0.5);
	// }


	.post_info {
		width: 100%;
		background: #F8F8F8;
		border-radius: 3rpx;
		padding: 10rpx 16rpx;
		font-size: 32rpx;
		color: #555555;
	}

	.commInputInner {
		background-color: #ffffff;
		position: fixed;
		z-index: 1003;
		bottom: 0;
		left: 0;
		width: 750rpx;
	}

	.scroll-w {
		margin-top: 100rpx;
		width: 100%;
		height: calc(100% - 300rpx);
	}

	.all-reply {}

	.article {
		padding: 30rpx 28rpx 0rpx 30rpx;

		&_avatar {
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
		}

		&_name {
			font-size: 30rpx;
			font-weight: bold;
			color: #121212;
		}

		&_content {
			font-size: 32rpx;
			color: #121212;
		}

		&_time {
			font-size: 24rpx;
			color: #939393;
		}

	}

	.footer {
		// position: fixed;
		// bottom: 0;
		// left: 0;
		width: 750rpx;
		height: 166rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 1rpx 20rpx 0rpx rgba(6, 0, 1, 0.03);
	}

	.say-more {
		width: 432rpx;
		height: 78rpx;
		background: #F5F5F5;
		border-radius: 39rpx;
		line-height: 78rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding-left: 36rpx;
		align-items: center;
	}
</style>
