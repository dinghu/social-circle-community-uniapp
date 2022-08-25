<template>
	<view class="container">
		<!-- <u-form> -->
		<!-- <u-form-item :border-bottom="false"> -->
		<!-- <input class="dis-title" placeholder="话题名称" v-model="form.name" /> -->
		<q-field label="话题名称" v-model="form.name" :required="true" placeholder="请填写话题名称"></q-field>
		<!-- </u-form-item> -->

		<!-- <u-form-item :border-bottom="false"> -->
		<q-field label="话题介绍" type="textarea" v-model="form.content" placeholder="一句话介绍要讨论的话题"></q-field>
		<!-- <textarea placeholder="一句话介绍要讨论的话题" v-model="form.content" class="post-txt"></textarea> -->
		<!-- </u-form-item> -->
		<!-- </u-form> -->
		<view class="f-fixed">
			<!-- <u-button class="plus-btn" type="error" shape="circle" :disabled="btnDisabled" :loading="btnLoading"
				@click="disAdd">创建话题</u-button> -->
			<q-button @click="disAdd" :disabled="btnDisabled">创建话题</q-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btnDisabled: false,
				btnLoading: false,
				form: {
					forumId: "",
					content: "",
					name: "",
				},
				header: {
					token: uni.getStorageSync("token")
				}
			};
		},
		onLoad(options) {
			this.form.forumId = options.topicId;
		},
		methods: {
			disAdd() {
				this.btnDisabled = true;
				this.btnLoading = true;

				if (!this.form.name) {
					this.$refs.uToast.show({
						title: "标题不能为空",
						type: 'error'
					})
					this.btnDisabled = false;
					this.btnLoading = false;
					return;
				} else if (!this.form.content) {
					this.$refs.uToast.show({
						title: "内容不能为空",
						type: 'error'
					})
					this.btnDisabled = false;
					this.btnLoading = false;
					return;
				} else {
					this.$H.post("app/topic/save", this.form).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'success'
							})
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error'
							})
						}
						this.btnDisabled = false;
						this.btnLoading = false;
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dis-title {
		padding: 30rpx 0;
	}

	.post-txt {
		width: calc(100% - 40rpx);
		padding: 20rpx;
		background-color: #F5F5F5;
		border-radius: 20rpx;
	}
</style>
