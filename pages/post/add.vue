<template>
	<view class="container">
		<input v-model="form.title" class="title-input" placeholder="标题(选填)" />
		<textarea placeholder="这一刻的想法..." :auto-height="true" maxlength="-1" v-model="form.content"
			class="post-txt"></textarea>
		<!-- 上传图片 -->
		<block v-if="form.type == 1">
			<u-upload ref="uUpload" :size-type="['compressed']" name="file" :max-count="9" :header="header"
				:action="uploadImgUrl" @on-uploaded="submit" :auto-upload="false"></u-upload>
		</block>
		<!-- 上传视频 -->
		<block v-if="form.type == 2">
			<view>上传视频</view>
			<view v-if="!form.videoUrl" class="upload-wrap" @click="chooseVideo">
				<image class="icon" src="/static/video.png"></image>
				<text>选择视频</text>
			</view>
			<video v-else @click="chooseVideo" :controls="false" class="upload-video u-m-l-10" :src="form.videoUrl"
				show-center-play-btn autoplay muted></video>
			<view class="u-m-t-20">视频封面</view>
			<u-upload ref="uUpload" name="file" :file-list="fileList1" :header="header" :action="uploadImgUrl"
				max-count="1" @on-uploaded="onUploaded1" :before-upload="beforeUpload" @on-remove="onRemove1">
			</u-upload>
		</block>
		<!-- 选择圈子 -->
		<navigator v-if="isTopic" url="/pages/choose-topic/choose-topic" class="choose-item">
			<image class="icon" src="/static/p_1.png"></image>
			<text class="txt">{{ topicName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 选择话题 -->
		<navigator v-if="!isTopic&&!isDiscuss" :url="'/pages/choose-discuss/choose-discuss?forumId=' + form.forumId"
			class="choose-item">
			<image class="icon" src="/static/m_1.png"></image>
			<text class="txt">{{ disName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 所在位置 -->
		<view @click="chooseLocation" class="choose-item">
			<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
			<text class="txt">{{ form.address || '所在位置' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="submit-btn">
			<q-button v-if="form.type == 1" @click="uploadImg" shape="circle">发布</q-button>
			<q-button v-if="form.type == 2" @click="videoSubmit" shape="circle">发布</q-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uploadImgUrl: this.$c.domain + 'app/file/upload',
				topicName: '选择圈子',
				disName: '选择话题',
				form: {
					title: '',
					type: 1,
					forumId: '',
					discuss_id: '',
					content: '',
					imageUrls: '',
					videoUrl: '',
					media: [],
					longitude: 0,
					latitude: 0,
					address: '',
					headImage: ''
				},
				header: {
					token: uni.getStorageSync('token')
				},
				isTopic: true,
				isDiscuss: false,
				fileList1: []
			};
		},
		onLoad(options) {
			this.form.type = options.type;

			if (options.is_topic) {
				this.isTopic = options.is_topic;
			}

			if (options.forumId) {
				this.form.forumId = options.forumId;
				this.isTopic = false;
			}
			if (options.discuss_id) {
				this.form.discuss_id = parseInt(options.discuss_id);
				this.isDiscuss = true;
			}

			let location = uni.getStorageSync('location_info');
			this.form.longitude = location.longitude;
			this.form.latitude = location.latitude;
		},
		methods: {
			beforeUpload() {
				uni.showLoading({
					mask: true,
					title: '上传中'
				});
			},
			onUploaded1(e) {
				this.form.headImage = e[0].response.data;
				uni.hideLoading();
			},
			onRemove1(index) {
				this.form.headImage = '';
			},
			chooseVideo() {
				var self = this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						let viedoPath = res.tempFilePath;
						uni.showModal({
							title: "",
							content: viedoPath
						})
						// uni.showLoading({
						// 	mask: true,
						// 	title: '上传中'
						// });

						uni.uploadFile({
							url: self.$c.domain + 'app/file/upload',
							filePath: viedoPath,
							name: 'file',
							header: {
								token: uni.getStorageSync('token')
							},
							success: uploadFileRes => {
								let upData = JSON.parse(uploadFileRes.data);
								console.log(JSON.stringify(upData))
								if (upData.code == 200 || upData.code == 0) {
									// self.form.media.push(upData.data);
									self.form.videoUrl = upData.data
								}
							},
							complete() {
								uni.hideLoading();
							}
						});
					}
				});
			},
			uploadImg() {
				if (!this.form.forumId) {
					this.$u.toast('请选择圈子');
					return;
				}

				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}

				if (this.form.content.length < 10) {
					this.$u.toast('内容不能少于10个字');
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$refs.uUpload.upload();
			},
			chooseLocation() {
				let that = this;
				uni.chooseLocation({
					success: function(res) {
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
						that.form.address = res.name;
						that.form.latitude = res.latitude;
						that.form.longitude = res.longitude;
					}
				});
			},
			videoSubmit() {
				if (!this.form.videoUrl) {
					this.$u.toast('请上传视频');
					return;
				}

				if (!this.form.forumId) {
					this.$u.toast('请选择圈子');
					return;
				}

				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}

				if (this.form.content.length < 5) {
					this.$u.toast('内容不能少于5个字');
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$H.post('app/post/addPost', this.form).then(res => {
					if (res.code == 200 || res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/video-detail?id=' + res.data.id
						});
					}
					uni.hideLoading();
				});
			},
			submit(e) {
				uni.showLoading({
					mask: true,
					title: '发布中'
				});

				let mediaList = [];
				console.log(e)
				e.forEach(function(item, index) {
					mediaList.push(item.response.data);
				});
				if (this.form.type == 1) {
					this.form.imageUrls = mediaList.join(",");
				} else if (this.form.type == 2) {
					this.form.videoUrl = mediaList[0];
				}

				if (this.form.discuss_id) {
					this.form.topicIds = JSON.stringify([this.form.discuss_id]);
				}

				this.$H.post('app/post/addPost', this.form).then(res => {
					if (res.code == 200 || res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/detail?id=' + res.data.id
						});
					}
					uni.hideLoading();
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.title-input {
		border-bottom: 1px solid #F5F5F5;
		margin: 20rpx 0;
		padding: 20rpx 0;
	}

	.post-txt {
		width: 100%;
		padding: 20rpx 0;
		min-height: 300rpx;
	}

	.upload-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 200rpx;
		background-color: #F5F5F5;
		margin-top: 30rpx;
		margin-left: 10rpx;
		border-radius: 10rpx;

		.icon {
			width: 50rpx;
			height: 50rpx;
		}

		text {
			font-size: 24rpx;
		}
	}

	.upload-video {
		width: 180rpx;
		height: 180rpx;
		margin-top: 30rpx;
	}

	.choose-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #F5F5F5;

		&:last-child {
			border: 0;
		}

		.txt {
			margin-left: 20rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.u-icon {
			margin-left: auto;
			color: #999;
		}

		.add-icon {
			margin-left: 0;
		}
	}

	.submit-btn {
		margin-top: 50rpx;
	}
</style>
