<template>
	<view>
		<discuss-list :list="disList" :loadStatus="loadStatus"></discuss-list>
	</view>
</template>

<script>
	import disList from '../../components/discuss-list/discuss-list';
	export default {
		components: {
			disList
		},
		data() {
			return {
				disList: [],
				loadStatus: "loadmore",
				page: 1,
				topicId: ""
			};
		},
		onLoad(options) {
			if (options.topic_id) {
				this.topicId = options.topic_id;
			}

			this.getDisList();
		},
		onReachBottom() {
			this.page++;
			this.getDisList();
		},
		methods: {
			getDisList() {
				this.loadStatus = "loading";
				this.$H.get("app/topic/list", {
					page: this.page,
					forumId: this.topicId
				}).then(res => {
					this.disList = this.disList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
