<template>
	<view>
		<!-- 顶部 -->
		<u-navbar back-text="返回" :title="user.username">
		</u-navbar>
		<!-- 页面主体 -->
		<view class="page-body">
			<block v-for="(item,index) in msgList" :key="index">
				<!-- 左边消息 -->
				<view v-if="item.fromId == user.userId" class="chat-item chat-item-left">
					<u-avatar :src="user.avatar" class="avatar"></u-avatar>
					<view class="conent">{{item.content}}</view>
				</view>
				<!-- 右边消息 -->
				<view v-else class="chat-item chat-item-right">
					<u-avatar class="avatar" :src="userInfo.avatar"></u-avatar>
					<view class="conent">{{item.content}}</view>
				</view>
			</block>
			<!-- 发送消息栏 -->
			<view style="height: 130rpx;"></view>
			<view class="msg-fad">
				<input type="text" v-model="mTxt" placeholder="请输入消息" />
				<u-button @click="sendMessage" type="success">发送</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import UniSocket from "@/utils/uni.socket.js"
	export default {
		data() {
			return {
				mTxt: "",
				msgList: [],
				userInfo: uni.getStorageSync("userInfo"),
				user: {},
				page: 1,
				socket: undefined,
			};
		},
		onLoad(options) {
			this.user = JSON.parse(options.user);
			this.conversationId = options.conversationId
			this.getMessage();
			this.initSocket()
		},
		destroyed() {
			this.destroySocket()
		},
		methods: {
			initSocket() {
				this.destroySocket()
				var that = this;
				let url = 'ws://192.168.8.156:9088/dy-community' + "/app/webSocket/chat/" + this.conversationId + "/" +
					this.userInfo.userId
				console.log(url);
				this.socket = new UniSocket({
					url: url,
					heartRate: 30000
				})
				this.socket.on('connectioned', function() {
					console.log('连接成功～～');
				})

				this.socket.on('connectioned', function() {

				}, true);

				this.socket.on('HEARTBEAT', function(data) {
					console.log('HEARTBEAT: ', data);
				})

				this.socket.on('PRIVATE_LETTER', function(data) {
					console.log('PRIVATE_LETTER: ', data);
					that.msgList.push(data)
					that.mTxt = "";
				}, true)
			},
			destroySocket() {
				if (this.socket) {
					this.socket.removeEventByName('connectioned')
					this.socket.removeEventByName('HEARTBEAT')
					this.socket.removeEventByName('PRIVATE_LETTER')
					this.socket.removeEventByName('*')
					this.socket.removeEventByName('**')
					this.socket.killApp()
					this.socket.close()
					this.socket = null
				}
			},
			getMessage() {
				this.$H.get("app/message/private/letter/chat/" + this.conversationId, {
					page: this.page
				}).then(res => {
					this.msgList = res.data.list;
					this.updateChatStatus();
				})
			},
			sendMessage() {
				let data = {
					toId: this.user.userId,
					content: this.mTxt
				}
				this.socket.emit('PRIVATE_LETTER', data)
				// this.$H.post("app/message/private/letter/send", {
				// 	toUserId: this.user.userId,
				// 	toName: this.user.nickName,
				// 	content: this.mTxt
				// }).then(res => {
				// 	if (res.code == 200 || res.code == 0) {
				// 		this.getMessage();
				// 		this.mTxt = "";
				// 	}
				// })
			},
			// 更新阅读状态
			updateChatStatus() {
				this.$H.post("message/updateChatStatus", {
					uid: this.user.uid
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'chat.scss';
</style>
