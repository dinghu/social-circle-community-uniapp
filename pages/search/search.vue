<template>
	<view class="container">
		<u-search placeholder="动态|圈子|用户" :show-action="true" v-model="keyword" @search="search" @custom="search"
			@focus="focus">
		</u-search>
		<!-- tabs -->
		<block v-if="!showHistory">
			<view class="tabs-box">
				<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			</view>

			<view v-show="current === 0">
				<post-list :list="postList" :loadStatus="loadStatus"></post-list>
			</view>
			<view v-show="current === 1">
				<user-list :list="userList" :loadStatus="loadStatus"></user-list>
			</view>
			<view v-show="current === 2">
				<topic-list :list="topicList" :loadStatus="loadStatus" loadmoreBgColor="#fff"></topic-list>
			</view>
		</block>
		<block v-else>
			<view class="empty-box" v-if="!searchHistory || searchHistory.length == 0">
				<image class="empty-img" mode="widthFix" src="../../static/search.png"></image>
				<text>搜索动态，圈子，用户</text>
			</view>
			<view class="search-history u-p-30" v-else>
				<view class="u-flex u-row-between">
					<view class="color-222 u-font-32">搜索历史</view>
					<image src="/static/images/icon_search_del.png" class="u-p-30" style="width: 27rpx;height: 29rpx;"
						@click="clearHistory">
					</image>
				</view>
				<!-- <view class="color-333 u-font-32">搜索历史</view> -->
				<view class="u-flex u-flex-wrap u-m-t-30">
					<view class="search-history-item u-m-r-20 u-m-b-20" v-for="(item, index) of searchHistory" :key="index"
						@click="historySearch(item)">{{item}}
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	import topicList from '../../components/topic-list/topic-list.vue';
	import userList from '../../components/user-list/user-list.vue';
	export default {
		components: {
			postList,
			topicList,
			userList
		},
		onLoad(options) {
			let searchHistory = uni.getStorageSync("searchHistory")
			if (searchHistory) {
				this.searchHistory = searchHistory
			}
			console.log('searchHistory:' + JSON.stringify(searchHistory))
		},
		data() {
			return {
				searchHistory: [],
				keyword: '',
				tabList: [{
						name: '动态'
					},
					{
						name: '用户'
					},
					{
						name: '圈子'
					}
				],
				current: 0,
				postList: [],
				userList: [],
				topicList: [],
				cartList: [],
				goodsList: [],
				pagePost: 1,
				pageUser: 1,
				topicPage: 1,
				cartPage: 1,
				goodsPage: 1,
				loadStatus: 'loadmore',
				cartList: [],
				modelShow: false,
				checkCart: {},
				showHistory: true,
			};
		},
		onReachBottom() {
			let type = this.current;
			if (type === 0) {
				this.pagePost++;
				this.getPostList();
			}

			if (type === 1) {
				this.pageUser++;
				this.getUserList();
			}

			if (type === 2) {
				this.topicPage++;
				this.getTopicList();
			}
		},
		methods: {
			focus(vale) {
				this.showHistory = true
			},
			clearHistory() {
				uni.showModal({
					title: '提示',
					content: '确认清空搜索历史?',
					success: (res) => {
						if (res.confirm) {
							uni.setStorageSync("searchHistory", '');
							this.searchHistory = []
						}
					}
				})
			},
			addHistory() {
				if (this.keyword) {
					let keywordIndex = this.searchHistory.indexOf(this.keyword)
					if (keywordIndex != -1) {
						this.searchHistory.splice(keywordIndex, 1)
					}
					this.searchHistory.unshift(this.keyword)
					uni.setStorageSync("searchHistory", this.searchHistory);
				}
			},
			historySearch(keyword) {
				this.keyword = keyword
				this.search()
			},
			search() {
				if (!this.keyword) {
					this.$u.toast('请输入搜索关键字')
					return
				}
				this.showHistory = false
				this.$nextTick(() => {
					this.onChange();
				})
			},
			onChange() {
				if (this.keyword) {
					let type = this.current;

					this.pagePost = 1;
					this.pageUser = 1;
					this.topicPage = 1;

					if (type === 0) {
						this.postList = [];
						this.getPostList();
					}

					if (type === 1) {
						this.userList = [];
						this.getUserList();
					}

					if (type === 2) {
						this.topicList = [];
						this.getTopicList();
					}
					//记录搜索历史
					this.addHistory();
				}
			},
			getUserList() {
				this.loadStatus = 'loading';
				this.$H.get('app/user/search', {
					keywords: this.keyword,
					page: this.pageUser
				}).then(res => {
					this.userList = this.userList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},
			getTopicList() {
				this.loadStatus = 'loading';
				this.$H.get('app/forum/search', {
					keywords: this.keyword,
					page: this.topicPage
				}).then(res => {
					this.topicList = this.topicList.concat(res.data.list);
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},
			getPostList() {
				// http://localhost:9088/dy-community/app/post/search?keywords=%E7%AF%AE%E7%90%83%E4%B9%8B%E7%A5%9E
				this.loadStatus = 'loading';
				this.$H.get('app/post/search', {
					keywords: this.keyword,
					page: this.pagePost
				}).then(res => {
					this.postList = this.postList.concat(res.data.list);
					console.log(JSON.stringify(this.postList))
					if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				});
			},
			tabChange(index) {
				this.current = index;

				if (index === 0) {
					this.postList = [];
					this.getPostList();
				}

				if (index === 1) {
					this.userList = [];
					this.getUserList();
				}

				if (index === 2) {
					this.topicList = [];
					this.getTopicList();
				}
			}
		}
	};
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	@import 'search.scss';

	.search-history-item {
		height: 60rpx;
		padding: 0 20rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		border-radius: 12rpx;
		background: #F5F5F5;
		color: #222222;
	}
</style>
