<template>
	<view>
		<discuss-list :list="discussList" :loadStatus="loadStatus"></discuss-list>
	</view>
</template>

<script>
	import discussList from '../../components/discuss-list/discuss-list.vue';
	export default {
		components: {
			discussList
		},
		data() {
			return {
				discussList: [],
				loadStatus: "loadmore",
				page: 1
			};
		},
		onLoad() {
			this.getDiscussList();
		},
		onReachBottom() {
			this.page++;
			this.getDiscussList();
		},
		methods: {
			getDiscussList() {
				this.loadStatus = "loading";
				this.$H.get("app/topic/list", {
					page: this.page,
					userId: uni.getStorageSync('userInfo').userId
				}).then(res => {
					this.discussList = this.discussList.concat(res.data.list);
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

<style lang="scss">

</style>
