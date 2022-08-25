<template>
	<view>
		<q-field label="圈子类目" :required="true" :disabled="true" type="select" :isClick="true" @click="jumpClass"
			placeholder="请选择" :value="cateName"></q-field>
		<q-field label="圈子名称" v-model="form.name" :required="true" placeholder="请填写圈子名称"></q-field>
		<q-field label="圈子介绍" type="textarea" v-model="form.content" :required="true" placeholder="请填写圈子介绍">
		</q-field>
		<view class="upload-wrap u-m-l-16">
			<u-form-item :required="true" label="圈子头像" label-position="top" :border-bottom="false">
				<u-upload ref="uUpload" name="file" :header="header" :action="uploadImgUrl" @on-remove="onRemove1"
					:before-upload="beforeUpload" max-count="1" @on-uploaded="onUploaded1"></u-upload>
			</u-form-item>
			<u-form-item :required="true" label="圈子背景" label-position="top" :border-bottom="false">
				<u-upload ref="uUpload" name="file" :header="header" :action="uploadImgUrl" @on-remove="onRemove2"
					:before-upload="beforeUpload" max-count="1" @on-uploaded="onUploaded2"></u-upload>
			</u-form-item>
		</view>
		<!-- 提交按钮 -->
		<q-button shape="circle" @click="submit">提交</q-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cateList: [],
				cateName: '',
				// uploadImgUrl: this.$c.domain + 'common/upload',
				uploadImgUrl: this.$c.domain + 'app/file/upload',
				header: {
					token: uni.getStorageSync('token')
				},
				form: {
					cateId: '',
					name: '',
					content: '',
					image: '',
					bgImage: ''
				}
			};
		},
		onLoad() {
			this.getCate();
		},
		methods: {
			beforeUpload() {
				uni.showLoading({
					mask: true,
					title: '上传中'
				});
			},
			jumpClass() {
				uni.navigateTo({
					url: 'shoose-class'
				});
			},
			onRemove1() {
				this.form.image = '';
			},
			onRemove2() {
				this.form.bgImage = '';
			},
			onUploaded1(e) {
				this.form.image = e[0].response.data;
				uni.hideLoading();
			},
			onUploaded2(e) {
				this.form.bgImage = e[0].response.data;
				uni.hideLoading();
			},
			submit() {
				if (!this.form.cateId) {
					this.$u.toast('请选择圈子类目');
					return;
				}

				if (!this.form.name) {
					this.$u.toast('请填写圈子名称');
					return;
				}

				if (!this.form.content) {
					this.$u.toast('请填写圈子介绍');
					return;
				}

				if (!this.form.image) {
					this.$u.toast('请上传圈子头像');
					return;
				}

				if (!this.form.bgImage) {
					this.$u.toast('请上传圈子主页背景图');
					return;
				}

				this.$H.post('app/forum/add', this.form).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.$u.toast('成功创建圈子');
						uni.redirectTo({
							url: '/pages/topic/detail?id=' + res.data.id
						});
					}
				});
			},
			getCate() {
				this.$H.get('app/forum/forumCates').then(res => {
					this.cateList = res.data;
				});
			}
		}
	};
</script>

<style>
	page {
		background-color: #fff;
	}

	.upload-wrap {
		padding: 30rpx;
	}
</style>
