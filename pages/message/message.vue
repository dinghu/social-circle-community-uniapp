<template>
	<view class="u-p-t-30">
		<u-grid :col="3" :border="false">
			<u-grid-item index="1" @click="toNav(2)">
				<u-badge :count="msgNum.zanCount" :offset="[0, 66]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/souc.png"></image>
				<view class="grid-text">赞</view>
			</u-grid-item>
			<u-grid-item index="2" @click="toNav(5)">
				<u-badge :count="msgNum.followCount" :offset="[0, 66]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/gz.png"></image>
				<view class="grid-text">新增关注</view>
			</u-grid-item>
			<u-grid-item index="3" @click="toNav(1)">
				<u-badge :count="msgNum.commentCount" :offset="[0, 66]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/pl.png"></image>
				<view class="grid-text">评论</view>
			</u-grid-item>
		</u-grid>
		<view class="msg-wrap">
			<view class="title">
				<view class="left">私信</view>
			</view>
			<!-- 图文消息 -->
			<block v-if="msgNum.article_msg_list.length > 0">
				<navigator @longpress="onPressArticle(item.m_id, index)"
					:url="'/pages/webview/webview?src=' + item.content" class="msg-item"
					v-for="(item, index) in msgNum.article_msg_list" :key="index" @click="articleMsgState(item.m_id)">
					<view class="avatar-box">
						<u-badge v-if="item.status == 0" :is-dot="true" :offset="[5, 10]" type="error"></u-badge>
						<u-avatar class="avatar" :src="item.user_info.avatar"></u-avatar>
					</view>
					<view class="right">
						<view>
							<text style="margin-right: 10rpx;">{{ item.user_info.username }}</text>
							<u-tag bg-color="#8687fd" text="官方" type="error" size="mini" mode="dark" />
						</view>
						<view class="desc">
							<text>{{ item.title }}</text>
							<text class="time">{{ item.create_time | timeFrom }}</text>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="msgNum.chatMsgList.length > 0">
				<navigator @longpress="onPressChat(item.userInfo.userId, index)"
					:url="'/pages/chat/chat?conversationId='+item.conversationId+'&user=' + $f.tostring(item.userInfo)"
					class="msg-item" v-for="(item, index) in msgNum.chatMsgList" :key="index">
					<view class="avatar-box">
						<u-badge :count="item.count" :offset="[5, 10]" type="error"></u-badge>
						<u-avatar class="avatar" :src="item.userInfo.avatar"></u-avatar>
					</view>
					<view class="right">
						<view>
							<text style="margin-right: 10rpx;">{{ item.userInfo.nickName }}</text>
						</view>
						<view class="desc">
							<!-- <text>{{ item.content }}</text> -->
							<rich-text :nodes="item.content"></rich-text>
							<text class="time">{{ item.createTime | timeFrom }}</text>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="msgNum.chatMsgList.length == 0 && msgNum.article_msg_list.length == 0">
				<view class="msg-empty">
					<image class="img" mode="widthFix" src="/static/empty.png"></image>
					<text class="txt">暂无新消息</text>
				</view>
			</block>
		</view>
		<!-- 删除图文消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showSheet" @click="onSheetItem"></u-action-sheet>
		<!-- 删除私信消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showChatSheet" @click="onSheeChat"></u-action-sheet>
		<!-- tabbar -->
		<!-- <q-tabbar :active="3" :count="msgCount"></q-tabbar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showSheet: false,
				showChatSheet: false,
				sheetList: [{
					text: '删除',
					color: 'red'
				}],
				msgNum: {
					zanCount: 0,
					followCount: 0,
					commentCount: 0,
					article_msg_list: [],
					chatMsgList: []
				},
				checkedMsgId: '',
				checkedIndex: '',
				checkedMsgUid: ''
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum;
			}
		},
		onShow() {
			let user = uni.getStorageSync('userInfo');
			if (user && user.userId) {
				this.getMsgNum();
				this.getConversation();
			}
		},
		methods: {
			getConversation() {
				this.$H.get('app/message/private/letter/conversation/list', {
					page: 1,
					limit: 9999
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.msgNum.chatMsgList = res.data.list
					}
				});
			},
			// 更新阅读状态
			articleMsgState(id) {
				this.$H.post('message/articleMsgState', {
					post_id: id
				});
			},
			// 长按图文消息
			onPressArticle(id, index) {
				this.showSheet = true;
				this.checkedMsgId = id;
				this.checkedIndex = index;
			},
			// 长按私信
			onPressChat(uid, index) {
				this.showChatSheet = true;
				this.checkedIndex = index;
				this.checkedMsgUid = uid;
			},
			// 删除图文消息
			onSheetItem(index) {
				if (index == 0) {
					this.$H.post('message/delMsg', {
						id: this.checkedMsgId
					}).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.msgNum.article_msg_list.splice(this.checkedIndex, 1);
						}
					});
				}
			},
			// 删除私信消息
			onSheeChat(index) {
				if (index == 0) {
					this.$H.post('message/delChat', {
						uid: this.checkedMsgUid
					}).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.msgNum.chatMsgList.splice(this.checkedIndex, 1);
						}
					});
				}
			},
			getMsgNum() {
				this.$H.post('app/message/messageNum').then(res => {
					if (res.code == 200 || res.code == 0) {
						this.msgNum.commentCount = res.data.commentCount
						this.msgNum.followCount = res.data.followCount
						this.msgNum.zanCount = res.data.zanCount
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
			toNav(e) {
				if (e == 1) {
					uni.navigateTo({
						url: '/pages/message/comment?type=' + e
					});
				} else if (e == 2) {
					uni.navigateTo({
						url: '/pages/message/zan?type=' + e
					});
				} else if (e == 5) {
					uni.navigateTo({
						url: '/pages/message/follow?type=' + e
					});
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	.nav-icon {
		width: 90rpx;
		height: 90rpx;
		margin-bottom: 10rpx;
	}

	.msg-wrap {
		background-color: #FFFFFF;
		margin-top: 20rpx;

		.title {
			margin: 20rpx;
		}

		.msg-item {
			padding: 20rpx;
			display: flex;

			.avatar-box {
				position: relative;

				.avatar {
					margin-right: 20rpx;
				}
			}

			.right {
				display: flex;
				flex-direction: column;
				flex: 1;

				.desc {
					font-size: 24rpx;
					color: #999;
					display: flex;

					.time {
						white-space: nowrap;
						margin-left: auto;
					}
				}
			}
		}
	}

	// 
	.msg-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 800rpx;

		.img {
			width: 200rpx;
			margin-top: 100rpx;
		}

		.txt {
			color: #999;
			font-size: 20rpx;
			margin-top: 20rpx;
		}
	}
</style>
