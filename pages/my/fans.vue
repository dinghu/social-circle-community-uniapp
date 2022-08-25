<template>
	<view>
		<user-list :list="userList" :loadStatus="loadStatus"></user-list>
	</view>
</template>

<script>
	import userList from '../../components/user-list/user-list.vue';
	export default {
		components: {
			userList,
		},
		data() {
			return {
				userList: [],
				page: 1,
				loadStatus: "loadmore"
			};
		},
		onLoad() {
			this.getUserList();
		},
		onReachBottom() {
			this.page++;
			this.getUserList();
		},
		methods: {
			getUserList() {
				this.loadStatus = "loading";
				let userId = uni.getStorageSync("userInfo").userId
				this.$H.get('app/user/fans/list/' + userId, {
					page: this.page
				}).then(res => {
					this.userList = this.userList.concat(res.data.list);
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
