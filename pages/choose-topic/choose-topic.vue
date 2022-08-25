<template>
	<view>
		<view class="topic-item" @click="chooseTopic(item.id, item.name)" v-for="(item, index) in topicList"
			:key="index">
			<u-image class="cover-img" width="120rpx" height="120rpx" border-radius="10rpx" :src="item.image">
			</u-image>
			<view class="center">
				<view>{{ item.name.substring(0, 10) }}</view>
				<view class="desc u-m-t-8">{{ item.content | replace }}</view>
			</view>
			<view class="count-box">
				<text>{{ item.joinNum || 0 }}圈友</text>
				<text>{{ item.postNum || 0 }}动态</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topicList: [],
				loadStatus: 'loadmore',
				page: 1
			};
		},
		onLoad(options) {
			this.getTopicList();
		},
		filters: {
			replace(str) {
				str = str.replace(/\n/g, '');
				return str.substring(0, 40);
			}
		},
		onReachBottom() {
			this.page++;
			this.getTopicList();
		},
		methods: {
			getTopicList() {
				this.$H
					.get('app/forum/list', {
						page: this.page
					})
					.then(res => {
						this.topicList = this.topicList.concat(res.data.list);
						if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					});
			},
			chooseTopic(id, name) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.form.forumId = id;
				prevPage.$vm.topicName = name;
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import 'choose-topic.scss';
</style>
