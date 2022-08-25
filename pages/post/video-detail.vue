<template>
	<view v-if="postDetail">
		<view style="width: 100%;height: 500rpx;">
			<video id="myVideo" :src="postDetail.videoUrl" @error="videoErrorCallback" controls autoplay
				style="width: 100%;height: 500rpx;" loop objectFit="cover" :poster="postDetail.headImage"></video>
		</view>
		<view class="info-box">
			<view class="user-item">
				<view @click.stop="jumpUser(postDetail.createUid)" class="u-m-r-10">
					<u-avatar class="avatar" :src="postDetail.createUserAvatar"
						:show-level='postDetail.createUserType == 1' level-bg-color="#8072f3"></u-avatar>
				</view>
				<!-- <image @click="jumpUser(postDetail.createUid)" :src="postDetail.createUserAvatar"></image> -->
				<view class="user-item-user">
					<text class="user-name u-font-28">{{ postDetail.createUserName }}</text>
					<!-- <view class="cxplain">{{ postDetail.userInfo.intro }}</view> -->
					<view class="cxplain">{{ postDetail.createTime | timeFrom }}</view>
				</view>
				<u-button v-show="postDetail.isFollow" size="mini" style="float:right;font-size: 14px;"
					@click="cancelFollow">已关注</u-button>
				<u-button v-show="!postDetail.isFollow" size="mini" style="float:right;font-size: 14px;"
					@click="follow">关注</u-button>
			</view>
			<view class="icon">
				<text>{{ postDetail.createTime | timeFrom }}</text>
			</view>
			<view class="hr"></view>
			<view class="post-title">{{ postDetail.title }}</view>
			<view class="u-m-b-20">
				<rich-text class="post-text" @longpress="onCopy" :nodes="postDetail.content"></rich-text>
			</view>

			<!-- 圈子信息 -->
			<navigator class="topic-info" :url="'/pages/topic/detail?id=' + postDetail.forumId"
				v-if="postDetail.forumId&&postDetail.forumName">
				<image mode="aspectFill" class="cover" :src="postDetail.forumImage"></image>
				<view class="center">
					<view class="desc">{{ postDetail.forumName.substring(0, 15) }}</view>
					<view class="count-txt">{{ postDetail.forumJoinNum || 0}}人加圈 |
						{{ postDetail.forumPostNum || 0 }}篇内容
					</view>
				</view>
				<view class="right u-m-r-16">
					<text>去看看</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</navigator>
			<!--点赞、分享、评论-->
			<view class="p-footer">
				<block v-if="postDetail.isZan == 1">
					<view class="p-item" @click="addZan(0)">
						<!-- <text class="iconfont icon-lujing" style="color: #d81e06;"></text> -->
						<text class="iconfont icon-lujing" style="color: #d81e06;"></text>
						<text class="u-m-l-10">{{ postDetail.zanNum || 0 }}</text>
					</view>
				</block>
				<block v-else>
					<view class="p-item" @click="addZan(1)">
						<!-- <text class="iconfont icon-shoucang"></text> -->
						<text class="iconfont icon-shoucang"></text>
						<text class="u-m-l-10">{{ postDetail.zanNum || 0 }}</text>
					</view>
				</block>
				<block v-if="postDetail.isCollection == 1">
					<view class="p-item" @click="cancelCollection">
						<!-- <u-icon size="40" name="star-fill" color="#d81e06"></u-icon> -->
						<text class="iconfont icon-favorfill" style="color: #d81e06;"></text>
						<text>{{ postDetail.collectNum || 0 }}</text>
					</view>
				</block>
				<block v-else>
					<view class="p-item" @click="addCollection">
						<text class="iconfont icon-favor"></text>
						<!-- <u-icon size="40" name="star" color="#616161"></u-icon> -->
						<text>{{ postDetail.collectNum || 0 }}</text>
					</view>
				</block>
				<view class="p-item" @click="focus = true">
					<text class="iconfont icon-pinglun"></text>
					<text>{{ postDetail.commentNum || 0 }}</text>
				</view>
				<view class="p-item" @click="showShare = true">
					<text class="iconfont icon-forward"></text>
					<text>分享</text>
				</view>
			</view>
		</view>
		<view class="comment-box">
			<view class="top-flag" id="top-flag" />
			<view class="title">评论（{{ commentList.length }}）</view>
			<view style="height: 20rpx;"></view>
			<view v-for="(item, index) in commentList" :key="index">
				<view class="comment-item" @longpress="delComment(item, index)">
					<image @click="jumpUser(item.userId)" class="avatar" :src="item.userAvatar"></image>
					<view class="c-content" @click="onReply(item)">
						<view class="user">
							<text>{{ item.userName }}</text>
							<block v-if="item.isZan == 1">
								<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.zanNum }}</text>
									<u-icon class="icon" size="34" name="heart-fill" color="#e62e00"></u-icon>
								</view>
							</block>
							<block v-else>
								<view @click.stop="onThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.zanNum }}</text>
									<u-icon class="icon" size="34" name="heart-fill" color="#bfbfbf"></u-icon>
								</view>
							</block>
						</view>
						<text class="u-font-32 u-m-t-26 replay_content auto-line">{{ item.content }}</text>
						<!-- <text class="time u-m-t-20">{{ item.createTime | timeFrom }}</text> -->
						<view class="u-flex u-row-between u-m-t-20">
							<view>
								<text class="time">{{item.createTime | timeFrom }}</text>
								<text class="color-333 u-m-l-30 u-font-24" @click="replyClick">回复</text>
							</view>

							<text class="u-font-24" style="color: #AAAAAA;" @click.stop="deleteClick(item, index)"
								v-if="item.canDel == 1">删除</text>
						</view>

						<view class="subContent u-m-t-20" v-if="item.replyNum>0">
							<view class="u-p-20 " @click.stop="moreReplay(item,index)">
								<view class="auto-line" style="width: 100%;" v-if="item.reply">
									<view class="u-flex">
										<text class="replyContent_replayMan u-font-24">{{item.reply.userName}}:</text>
										<!-- <text class="u-m-l-10 u-font-24 u-m-r-10 color-sub ">回复{{comment.reply.nickname}}：</text> -->
										<text class="u-font-24">{{item.reply.content}} </text>
										<!-- #ifdef APP-NVUE -->
										<text
											class="replyContent_time u-font-24">{{$appUtils.dateUtils.format(item.reply.createTime) }}</text>
										<!-- #endif -->
										<!-- #ifndef APP-NVUE -->
										<text
											class="replyContent_time u-font-24">{{$appUtils.dateUtils.format(item.reply.createTime)}}</text>
										<!-- #endif -->
									</view>
								</view>
								<view v-if="item.replyNum>1">
									<text class="u-font-24" style="color: #B38D4F;">全部{{item.replyNum}}条回复</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-gap height="1" bg-color="#EEEEEE" style="margin-left: 110rpx;"></u-gap>
			</view>
			<!-- 加载状态 -->
			<block v-if="commentList.length > 0">
				<view style="margin: 30rpx;">
					<u-loadmore :status="loadStatus" />
				</view>
			</block>
			<block v-else>
				<u-empty text="暂无评论" mode="message"></u-empty>
			</block>
		</view>
		<view style="height: 200rpx;"></view>

		<view class="say-footer u-flex" v-if="false">
			<view class="say-more u-m-l-30">
				<image src="/static/images/icon_detail_edit.png" style="width: 29rpx;height: 33rpx;" />
				<text class="u-font-28 u-m-l-24" style="color: #666666;" @click="showInput">说点什么...</text>
			</view>
			<view class="u-flex u-m-l-20 u-row-between u-flex-1 u-m-r-14">
				<view class="u-flex">
					<image
						:src="postDetail.iszan==1?'/static/images/icon_detail_like_a.png':'/static/images/icon_detail_like.png' "
						style="width: 56rpx;height: 48rpx;" @click="articlezan" />
					<text class="u-m-l-10 color-333">{{postDetail.zanNum}}</text>
				</view>
				<view class="u-flex">
					<image
						:src="postDetail.iscollect==1?'/static/images/icon_detail_collect_a.png':'/static/images/icon_detail_collect_p.png'"
						style="width: 54rpx;height: 54rpx;" @click="articlecollect" />
					<text class="u-m-l-10 color-333">{{postDetail.collectNum}}</text>
				</view>
				<view class="u-flex">
					<image src="/static/images/icon_detail_replay.png" style="width: 52rpx;height: 52rpx;"
						@click="showInput" />
					<text class="u-m-l-10 color-333">{{postDetail.commentNum}}</text>
				</view>
			</view>
		</view>

		<!-- 评论输入框 -->
		<view class="commInput">
			<!-- 评论输入弹出层 -->
			<comm-input ref="commInput" @send="fnCommSend" :placeholder="placeholder"></comm-input>
		</view>

		<!-- 	<view class="comment-tool">
			<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
				v-model="form.content" auto-height="true" placeholder-class="txt-placeholder"
				:adjust-position="false"></textarea>
			<u-button type="warning" @click="addComment" :disabled="isSubmitD" style="border-radius: 0;">发布</u-button>
		</view> -->
		<!-- 分享选择弹窗 -->
		<q-popup v-model="showShare" height="240rpx">
			<view class="share-wrap" @click="showShare = false">
				<button open-type="share" class="share-item u-reset-button">
					<image src="/static/wechat.png"></image>
					<text>微信好友</text>
				</button>
				<view class="share-item" @click="shareCanvas">
					<image src="/static/img.png"></image>
					<text>分享海报</text>
				</view>
			</view>
		</q-popup>
		<!-- 海报弹窗 -->
		<u-popup v-model="showCanvas" mode="center" width="80%">
			<view class="canvas-box">
				<canvas style="width: 300px;height: 450px;" canvas-id="shareCanvas"></canvas>
				<view class="footer">
					<u-button :custom-style="shareBtnStyle" @click="saveImgToAlbum" type="success" shape="circle">保存/分享
					</u-button>
				</view>
			</view>
		</u-popup>
		<comment-more-pop @close="closeMorePop" ref="morePop" @commentReplyNumChange="commentReplyNumChange"
			@commentzan="commentzanRecall">
		</comment-more-pop>
	</view>
</template>

<script>
	const deviceInfo = uni.getSystemInfoSync()

	if (deviceInfo.brand == 'Xiaomi') {
		deviceInfo.windowHeight += 1
	}
	// 评论列表单元组件
	import CommInput from '@/components/comm-input/comm-input'
	import CommMorePop from '@/components/comment-more-pop/comment-more-pop'
	export default {
		components: {
			CommInput,
			CommMorePop
		},
		data() {
			return {
				unitId: this.$c.postDetailAd,
				postId: 0,
				postDetail: '',
				focus: false,
				isSubmitD: false,
				commentList: [],
				placeholder: '说点什么...',
				form: {
					type: 1,
					postId: '',
					content: '',
					//评论才使用的字段
					commentId: '',
					toReplyId: '',
					toReplyContent: '',
					toReplyUid: ''
				},
				showShare: false,
				showCanvas: false,
				shareBtnStyle: {
					backgroundColor: '#333'
				},
				page: 1,
				loadStatus: 'loadmore',
				isVoteExpire: false
			};
		},
		onLoad(options) {
			this.postId = options.id;

			if (options.scene) {
				this.postId = options.scene;
			}

			this.form.postId = this.postId;
			this.getPostDetail();
			this.getCommentList();

			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onReachBottom() {
			this.page++;
			this.getCommentList();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			let imgURL;
			if (this.postDetail.media.length > 0) {
				imgURL = this.postDetail.media[0];
			}
			return {
				title: this.postDetail.content,
				path: '/pages/post/detail?id=' + this.postId,
				imageUrl: imgURL
			};
		},
		onShareTimeline() {
			let imgURL = (imgURL = this.postDetail.media[0]);
			return {
				title: this.postDetail.content,
				imageUrl: imgURL,
				query: 'id=' + this.postId
			};
		},
		methods: {
			showInput() {
				this.$nextTick(() => {
					this.$refs.commInput.show()
				})
			},
			fnCommSend(value) {
				this.form.content = value
				this.addComment()
			},
			moreReplay(comment, pos) {
				this.focus = false;
				this.$nextTick(() => {
					this.$refs.morePop.open(comment, pos, deviceInfo.windowHeight)
				})
			},
			commentzanRecall(pos) {
				// this.commentzan(this.commentlist[pos], pos)
			},
			commentReplyNumChange(commentIndex, replynum) {
				// let comment = this.commentlist[commentIndex];
				// comment.replynum = replynum
			},
			timeFormat(dateTime = null, fmt = 'yyyy-mm-dd') {
				// 如果为null,则格式化当前时间
				if (!dateTime) dateTime = Number(new Date());
				// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
				if (dateTime.toString().length == 10) dateTime *= 1000;
				let date = new Date(dateTime);
				let ret;
				let opt = {
					"y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"h+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"s+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},
			voteSubmit() {
				let voteDate = [];
				this.postDetail.vote_info.options.forEach(item => {
					if (item.checked) {
						voteDate.push(item.id);
					}
				});

				this.$H
					.post('vote/userVote', {
						id: this.postDetail.vote_info.id,
						vote: voteDate
					})
					.then(res => {
						if (res.code == 200 || res.code == 0) {
							this.getPostDetail();
						}
					});
			},
			castVote(index, type) {
				if (!this.postDetail.is_vote_result && !this.isVoteExpire) {
					if (type === 1) {
						this.postDetail.vote_info.options.forEach(item => {
							this.$set(item, 'checked', false);
						});
					}
					let checked = this.postDetail.vote_info.options[index].checked;
					if (checked) {
						this.$set(this.postDetail.vote_info.options[index], 'checked', false);
					} else {
						this.$set(this.postDetail.vote_info.options[index], 'checked', true);
					}
				}
			},
			// 删除评论
			delComment(e, index, index2) {
				let that = this;
				let user = uni.getStorageSync('userInfo');

				if (e.createUid != user.createUid) {
					return;
				}

				uni.showModal({
					title: '提示',
					content: '确定删除该评论？',
					success: function(res) {
						if (res.confirm) {
							that.$H
								.post('app/post/comment/delete', {
									id: e.id
								})
								.then(res2 => {
									if (res2.code == 200) {
										if (index2 || index2 === 0) {
											that.commentList[index].children.splice(index2, 1);
										} else {
											that.commentList.splice(index, 1);
										}
									}
								});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			onCopy() {
				let that = this;
				uni.setClipboardData({
					data: this.postDetail.content,
					success: function() {
						uni.hideToast();
						that.$q.toast('复制成功', 'success');
					}
				});
			},
			// 保存海报到相册
			saveImgToAlbum() {
				let that = this;
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: 300,
					height: 450,
					canvasId: 'shareCanvas',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								that.showCanvas = false;
							}
						});
					}
				});
			},
			// 生成分享海报
			async shareCanvas() {
				uni.showLoading({
					mask: true,
					title: '正在生成海报'
				});

				this.showCanvas = true;
				this.showShare = false;
				var context = uni.createCanvasContext('shareCanvas');

				//白色背景矩形
				context.setFillStyle('#FFFFFF');
				context.fillRect(0, 0, 300, 450);

				//帖子封面
				let coverSrc;
				if (this.postDetail.media[0]) {
					coverSrc = this.postDetail.media[0];
				} else {
					coverSrc = 'https://' + this.$c.baseUrl + '/uploads/default_shre_bg.jpg';
				}

				let coverImg = await this.downloadFile(coverSrc);
				context.drawImage(coverImg, 0, 0, 300, 240);

				// 文字内容
				context.setFillStyle('#616161');
				context.setFontSize(14);
				this.drawText(context, this.postDetail['content'], 20, 270, 30, 260, 5);

				// 来源
				context.setFillStyle('#616161');
				context.setFontSize(14);
				context.fillText('来源：兴趣圈', 20, 430, 300);

				// 圈子二维码
				let qrCode = await this.getQrCode();
				let tempQrCode = await this.downloadFile(qrCode);
				context.drawImage(tempQrCode, 220, 370, 70, 70);

				context.draw();

				uni.hideLoading();
			},
			/**
			 * 绘制多行文本
			 * ctx canvas对象
			 * str 文本
			 * leftWidth 距离左侧的距离
			 * initHeight 距离顶部的距离
			 * titleHeight 文本的高度
			 * canvasWidth 文本的宽度
			 * canvasWidth 文本行数
			 * @returns {*}
			 */
			drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, maxRow) {
				let rowNum = 1;
				let lineWidth = 0;
				let lastSubStrIndex = 0; //每次开始截取的字符串的索引
				for (let i = 0; i < str.length; i++) {
					lineWidth += ctx.measureText(str[i]).width;
					if (lineWidth > canvasWidth && rowNum <= maxRow) {
						ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
						initHeight += 22; //22为 文字大小20 + 2
						lineWidth = 0;
						lastSubStrIndex = i;
						titleHeight += 22;

						rowNum++;
					}
					if (i == str.length - 1 && rowNum <= maxRow) {
						//绘制剩余部分
						ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
					}
				}
				// 标题border-bottom 线距顶部距离
				titleHeight = titleHeight + 10;
				return titleHeight;
			},
			downloadFile(url) {
				return new Promise(resolve => {
					uni.downloadFile({
						url: url,
						success: res => {
							resolve(res.tempFilePath);
						}
					});
				});
			},
			getQrCode() {
				return new Promise(resolve => {
					this.$H
						.get('post/qrCode', {
							id: this.postId
						})
						.then(res => {
							resolve(res.result);
						});
				});
			},
			// 点赞
			onThumbs(id, index, index2) {
				this.$H.post('app/post/comment/zan/' + id, {})
					.then(res => {
						if (res.code == 200 || res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isZan = 1;
								this.commentList[index].children[index2].zanNum++;
							} else {
								this.commentList[index].isZan = 1;
								this.commentList[index].zanNum++;
							}
						}
					});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				this.$H.post('app/post/comment/zan/' + id, {})
					.then(res => {
						if (res.code == 200 || res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isZan = 0;
								this.commentList[index].children[index2].zanNum--;
							} else {
								this.commentList[index].isZan = 0;
								this.commentList[index].zanNum--;
							}
						}
					});
			},
			// 回复评论
			onReply(e) {
				console.log(e)
				this.placeholder = '回复：' + e.userName;
				this.focus = true;
				this.form.commentId = e.id;
				this.form.postId = this.postId;
				this.$nextTick(() => {
					this.$refs.commInput.open()
				})
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '说点什么...';
				this.focus = false;
			},
			// 获取评论列表
			getCommentList() {
				this.loadStatus = 'loading';
				this.$H.get('app/post/comment/listPage', {
					postId: this.postId,
					page: this.page
				}).then(res => {
					if (res.code == 200 || res.code == 0) {
						this.commentList = this.commentList.concat(res.data.list);

						if (res.data.currPage >= res.data.totalPage || res.data.totalPage === 0) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					}
				});
			},
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			resetForm() {
				this.form = {
					type: 1,
					postId: '',
					content: '',
					//评论才使用的字段
					commentId: '',
					toReplyId: '',
					toReplyContent: '',
					toReplyUid: ''
				}
			},
			scrollToCommentTop() {
				uni.pageScrollTo({
					selector: '#top-flag', //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
					duration: 0
				});
			},
			addComment() {
				this.isSubmitD = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.isSubmitD = false;
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.form.postId = this.postId;
				//回复评论
				if (this.form.commentId) {
					this.$H.post('app/post/comment/replay', this.form).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.resetForm();
							this.$u.toast('回复成功');
							this.page = 1;
							this.commentList = [];
							this.getCommentList();
						}
						this.isSubmitD = false;
						uni.hideLoading();
					});
				} else {
					this.$H.post('app/post/comment/add', this.form).then(res => {
						if (res.code == 200 || res.code == 0) {
							this.form.content = '';
							this.resetForm();
							this.$u.toast('评论成功');
							// this.page = 1;
							// this.commentList = [];
							// this.getCommentList();
							this.commentList.unshift(res.data)
							this.scrollToCommentTop();
						}
						this.isSubmitD = false;
						uni.hideLoading();
					});
				}


			},
			getPostDetail() {
				this.$H.get('app/post/detail/' + this.postId, {})
					.then(res => {
						let postDetail = res.data;
						//图片转换
						if (postDetail.imageUrls) {
							postDetail.images = postDetail.imageUrls.split(",")
						} else {
							postDetail.images = []
						}
						this.postDetail = postDetail
						// 投票帖子
						if (res.vote_id && res.vote_id > 0) {
							res.vote_info.options.forEach(item => {
								this.$set(item, 'checked', false);
							});

							let timestamp = Date.parse(new Date()) / 1000;
							if (res.vote_info.expire_time < timestamp) {
								this.isVoteExpire = true;
							}
						}
					});
			},
			addZan(type) {
				this.$H.post('app/post/zan/' + this.postId)
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							if (type == 1) {
								this.postDetail.isZan = 1;
								this.postDetail.zanNum++;
							} else {
								this.postDetail.isZan = 0;
								this.postDetail.zanNum--;
							}
						}
					});
			},
			cancelCollection() {
				this.$H
					.post('app/post/collect/' + this.postId)
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.isCollection = 0;
							this.postDetail.collectNum--;
						}
					});
			},
			addCollection() {
				this.$H
					.post('app/post/collect/' + this.postId)
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.isCollection = 1;
							this.postDetail.collectNum++;
						}
					});
			},
			addThumb() {
				this.$H
					.post('post/addThumb', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.is_thumb = true;
						}
					});
			},
			cancelThumb() {
				this.$H
					.post('post/cancelThumb', {
						id: this.postId,
						uid: this.postDetail.createUid
					})
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.is_thumb = false;
						}
					});
			},
			follow() {
				this.$H.post('app/user/follow/' + this.postDetail.createUid, {})
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.isFollow = true;
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error'
							});
						}
					});
			},
			cancelFollow() {
				this.$H
					.post('app/user/follow/' + this.postDetail.createUid, {})
					.then(res => {
						if (res.code === 200 || res.code === 0) {
							this.postDetail.isFollow = false;
						}
					});
			},
			previewImage(e) {
				uni.previewImage({
					current: e.currentTarget.dataset.current, // 当前显示图片的http链接
					urls: e.currentTarget.dataset.image // 需要预览的图片http链接列表
				});
			},
			deleteClick(item, index) {
				this.delComment(item, index)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.commInput {
		background-color: #ffffff;
		position: fixed;
		z-index: 1000;
		bottom: 0;
		left: 0rpx;
		width: 750rpx;
		margin-right: 84rpx;
	}

	.replay_content {
		font-size: 32rpx;
		color: #121212;
	}

	.subContent {
		background-color: #F8F8F8;
		border-radius: 10rpx;
	}

	.subContent_replyContent {
		// overflow: hidden;
	}

	.replyContent_active {
		// display: none;
	}

	.replyContent_time {
		font-size: 22rpx;
		overflow: hidden;
		padding-left: 10rpx;
		color: #999;
	}

	.post-title {
		margin: 20rpx 0;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.info-box {
		padding: 20rpx;
		background-color: #ffffff;
	}

	.icon text {
		font-size: 12px;
		color: #999;
		margin-right: 20rpx;
	}

	/*关注*/

	.user-item {
		display: flex;

		.user-item-user {
			flex: 1;

			.cxplain {
				font-size: 12px;
				color: #999;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		image {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
		}
	}

	/*底部操作*/
	.p-footer {
		margin: 30rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #616161;

		.p-item {
			display: flex;
			align-items: center;

			.iconfont {
				font-size: 40rpx;
			}

			// &:nth-child(2) {
			// 	margin: 0 auto;
			// }

			.iconfont {
				margin-right: 10rpx;
			}
		}
	}

	/*评论列表*/
	.comment-box {
		background-color: #ffffff;
		margin-top: 20rpx;
		padding: 20rpx;
	}

	.comment-box>.title {
		margin-bottom: 0rpx;
	}

	.comment-item {
		display: flex;
		padding: 20rpx;

		&:active {
			background-color: #F5F5F5;
		}

		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;

			.time {
				// color: #999;
				// font-size: 10px;
				font-size: 24rpx;
				color: #939393;
			}

			.user {
				display: flex;
				font-size: 30rpx;
				font-weight: bold;
				color: #121212;

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						color: #999999;
						font-size: 26rpx;
						margin-right: 10rpx;
					}
				}
			}
		}

		.avatar {
			// width: 100rpx;
			// height: 100rpx;
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			// border: 1px solid #dd524d;
			margin-right: 24rpx;
		}
	}

	.sub-comment-item {
		margin-left: 100rpx;
		padding: 20rpx;

		&:active {
			background-color: #F5F5F5;
		}

		.user {
			display: flex;
			align-items: center;

			.name {
				color: #616161;
			}

			.avatar {
				margin-right: 10rpx;
			}

			.u-head {
				flex: 1;
				display: flex;

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.reply {
			.time {
				margin-left: auto;
				font-size: 20rpx;
				color: #999;
			}

			.name {
				display: inline-block;
				color: #2b85e4;
				font-weight: 600;
			}
		}
	}

	/* 评论tool */
	.comment-tool {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		z-index: 999;
	}

	.comment-tool textarea {
		background-color: #f5f5f5;
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}


	/*文章图片*/
	.img-style-1 {
		display: block;
		width: 100%;
		// max-height: 600rpx;
		border-radius: 5px;
	}

	.img-style-1 image {
		width: 100%;
		margin-bottom: 10rpx;
	}

	.img-style-2 {
		display: flex;
	}

	.img-style-2 image {
		margin: 5rpx;
		border-radius: 5px;
		width: 100%;
		height: 294rpx;
	}

	.img-style-3 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-3 image {
		width: 31.3%;
		height: 200rpx;
		margin: 1%;
		border-radius: 5px;
	}

	// 圈子信息
	.topic-info {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		background-color: #f5f5f5;
		margin: 20rpx 0;

		.cover {
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}

		.center {
			flex: 1;

			.count-txt {
				color: #999;
			}
		}

		.right {
			margin-left: 20rpx;
			color: #f29100;
		}
	}

	// 分享弹窗
	.share-wrap {
		display: flex;
		padding: 30rpx;
		width: 60%;
		margin: 0 auto;

		.share-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:nth-child(1) {
				margin-right: auto;
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}

	//海报弹窗
	.canvas-box {
		height: 500px;
		position: relative;

		.footer {
			position: absolute;
			bottom: 20rpx;
			left: 20rpx;
			right: 20rpx;
		}
	}

	// 投票
	.vote-box {
		background-color: #F5F5F5;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 20rpx;

		.title {
			font-weight: bold;
		}

		.expire-time {
			font-size: 24rpx;
			margin: 20rpx 0;
		}

		.vote-item {
			font-size: 24rpx;
			font-weight: bold;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 1px solid #999;
			text-align: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.active {
			background-color: #333;
			color: #fff;
		}
	}

	.expire-box {
		background-color: #999;
		color: #fff;
		font-size: 24rpx;
		display: inline-block;
		padding: 0 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	video {
		width: 100%;
	}

	.post-text {
		white-space: pre-wrap;
	}

	.say-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 166rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 1rpx 20rpx 0rpx rgba(6, 0, 1, 0.03);
		z-index: 100;
	}

	.say-more {
		width: 241rpx;
		height: 78rpx;
		background: #F5F5F5;
		border-radius: 39rpx;
		line-height: 78rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
