<template>
	<view>
		<post-list :list="postList" :loadStatus="loadStatus"></post-list>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	export default {
		components: {
			postList
		},
		data() {
			return {
				postList: [],
				loadStatus: "loading",
				page: 1
			};
		},
		onLoad() {
			this.getPostList();
		},
		onReachBottom() {
			this.page++;
			this.getPostList();

		},
		methods: {
			getPostList() {
				this.loadStatus = "loading";
				this.$H.get('app/post/listPage/me', {
					page: this.page,
					userId: this.uid
				}).then(res => {
					this.postList = this.postList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>
