<template>
	<view class="container">
		<view class="f-wrap">
			<u-form ref="uForm">
				<u-form-item label="圈子名称" label-width="auto">
					<u-input input-align="right" v-model="form.name" placeholder="请填写圈子名称" />
				</u-form-item>
				<u-form-item label="圈子描述" label-position="top">
					<u-input type="textarea" v-model="form.content" placeholder="请填写圈子描述" />
				</u-form-item>
				<u-form-item label="圈子封面" label-position="top">
					<u-upload ref="uUpload" name="file" :file-list="fileList1" :header="header" :action="uploadImgUrl"
						max-count="1" @on-uploaded="onUploaded1" :before-upload="beforeUpload" @on-remove="onRemove1">
					</u-upload>
				</u-form-item>
				<u-form-item label="圈子背景" label-position="top">
					<u-upload ref="uUpload" name="file" :file-list="fileList2" :header="header" :action="uploadImgUrl"
						max-count="1" @on-uploaded="onUploaded2" :before-upload="beforeUpload" @on-remove="onRemove2">
					</u-upload>
				</u-form-item>
			</u-form>
		</view>
		<!-- 提交按钮 -->
		<q-button shape="circle" @click="submit">提交</q-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				// uploadImgUrl: this.$c.domain + 'common/upload',
				uploadImgUrl: this.$c.domain + 'app/file/upload',
				header: {
					token: uni.getStorageSync('token')
				},
				form: {
					name: '',
					content: '',
					image: '',
					bgImage: ''
				},
				fileList1: [],
				fileList2: []
			};
		},
		onLoad(options) {
			this.getTopicInfo(options.topicId);
		},
		methods: {
			beforeUpload() {
				uni.showLoading({
					mask: true,
					title: '上传中'
				});
			},
			onUploaded1(e) {
				this.form.image = e[0].response.data;
				uni.hideLoading();
			},
			onUploaded2(e) {
				this.form.bgImage = e[0].response.data;
				uni.hideLoading();
			},
			onRemove1(index) {
				this.form.image = '';
			},
			onRemove2(index) {
				this.form.bgImage = '';
			},
			submit() {
				this.$H.post('app/forum/update', this.form).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.$u.toast('保存成功');
					}
				});
			},
			getTopicInfo(topicId) {
				this.$H.get('app/forum/info/' + topicId + "?isMore=1").then(res => {
					this.fileList1 = [{
						url: res.data.image
					}];
					this.fileList2 = [{
						url: res.data.bgImage
					}];
					this.form = res.data;
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
</style>
