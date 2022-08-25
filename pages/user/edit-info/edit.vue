<template>
	<view>
		<view class="c-wrap">
			<u-form ref="uForm" label-width="auto">
				<u-form-item label="头像">
					<u-avatar @click="onAvatar" mode="circle" slot="right" :src="userInfo.avatar" size="100"></u-avatar>
				</u-form-item>
				<u-form-item label="昵称" right-icon="arrow-right">
					<u-input @click="jump(userInfo.nickName,'nickName')" :placeholder="userInfo.nickName"
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="性别" right-icon="arrow-right">
					<u-input @click="showGender = true" :placeholder="userInfo.sex == 1?'男':userInfo.sex == 2?'女':'保密'"
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="个性签名" right-icon="arrow-right">
					<u-input @click="jump(userInfo.intro,'intro')" :placeholder="userInfo.intro" :disabled="true"
						input-align="right" />
				</u-form-item>
				<u-form-item label="标签" label-position="top" :border-bottom="false">
					<view @click="jump(userInfo.tag_str,'tags')" class="tag-box">
						<view v-for="(item,index) in userInfo.tag_str" :key="index" class="tag">{{item}}</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="f-fixed">
			<q-button @click="outlogin">退出登录</q-button>
		</view>
		<!-- 性别选择 -->
		<q-select v-model="showGender" :list="gender" @confirm="saveGender"></q-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {},
				userInfo: {},
				showGender: false,
				gender: [{
						lable: "男",
						value: 1
					},
					{
						lable: "女",
						value: 2
					},
					{
						lable: "保密",
						value: 0
					}
				]
			};
		},
		onShow(options) {
			this.getUserInfo();
		},
		methods: {
			// 修改性别
			saveGender(index) {
				this.showGender = false
				let gender = this.gender[index[0]].value;
				this.$H.post("app/user/update", {
					sex: gender
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.$u.toast('性别修改成功')
						this.userInfo.sex = this.gender[index[0]].value
					}
				})
			},
			getUserInfo() {
				this.$H.get("app/user/info/me").then(res => {
					console.log(res)
					this.userInfo = res.data;
					//图片转换
					if (this.userInfo.tags) {
						this.userInfo.tag_str = this.userInfo.tags.split(",")
					}
				})
			},
			jump(value, type) {
				uni.navigateTo({
					url: "/pages/user/edit-info/submit?value=" + JSON.stringify(value) + "&type=" + type
				})
			},
			outlogin() {
				uni.removeStorageSync("hasLogin");
				uni.removeStorageSync("token");
				uni.removeStorageSync("userInfo");
				uni.clearStorage()
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			comPressImage(localPath) {
				let that = this;
				console.log("压缩前大小-----------" + localPath.size)
				uni.compressImage({
					src: localPath,
					quality: 100,
					success: res => {
						console.log("compressImage-----------" + JSON.stringify(res))
						let compressImage = res.tempFilePath;
						console.log("压缩后大小-----------" + res.size)
						that.uploadFile(compressImage)
					},
					fail: (e) => {
						console.log(e)
						that.uploadFile(localPath)
					}
				})
			},
			uploadFile(filePath) {
				let that = this;
				uni.uploadFile({
					url: that.$c.domain + 'app/file/upload',
					filePath: filePath,
					name: 'file',
					header: {
						token: uni.getStorageSync("token")
					},
					success: (uploadFileRes) => {
						uni.hideLoading();
						let data = JSON.parse(uploadFileRes.data)
						if (data.code == 200 || data.code == 0) {
							that.updateAvatar(data.data)
						}
					}
				});
			},
			onAvatar() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						uni.showLoading({
							mask: true,
							title: "上传头像中"
						})
						// #ifdef H5
						that.uploadFile(res.tempFilePaths[0])
						// #endif

						// #ifndef H5
						that.comPressImage(res.tempFilePaths[0])
						// #endif

					}
				});

			},
			updateAvatar(avatar) {
				this.$H.post("app/user/update", {
					avatar: avatar
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.userInfo.avatar = avatar;
						this.$u.toast('头像修改成功')
					}
				})
			}
		}
	}
</script>
<style scoped>
	.c-wrap {
		padding: 20rpx;
		background-color: #FFFFFF;
	}

	.bind-mobile {
		display: flex;
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
