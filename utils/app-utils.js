var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + ' ' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function getToken() {
	let vuex_token = uni.getStorageSync('token');
	return vuex_token;
}

function getLoginUserId() {
	let userInfo = uni.getStorageSync('userInfo');
	if (userInfo) {
		return userInfo.userId;
	}

	return ''
}

function loginAndGoto(path) {
	if (getToken()) {
		if (path && path != '') {
			uni.navigateTo({
				url: path
			});
		}
		return
	}
	if (path && path != '') {
		uni.navigateTo({
			url: '/pages/user/sms-login?targetUrl=' + path
		});
	} else {
		uni.navigateTo({
			url: "/pages/user/sms-login"
		});
	}
}

function lunchLogin() {
	if (!getToken()) {
		uni.navigateTo({
			url: "/pages/user/sms-login"
		});
	}
}

function reLaunchLogin() {
	uni.reLaunch({
		url: "/pages/user/sms-login"
	});
}

function loginOut() {
	uni.clearStorage();
	uni.$u.vuex('vuex_user', null);
	uni.$u.vuex('vuex_token', '');
	uni.clearStorage()
}

function navigateBackDelay(delay) {
	setTimeout(() => {
		uni.navigateBack()
	}, delay)
}

function goPost(item) {
	let url;
	// 图文
	if (item.type == 1 || item.type == 4 || item.type == 0) {
		url = '/pages/post/detail?id=' + item.id;
	}
	//视频
	else if (item.type == 2) {
		// url = '/pages/video/index?id=' + e.id
		url = '/pages/post/video-detail?id=' + item.id;
	}
	uni.navigateTo({
		url: url
	});
}


module.exports = {
	dateUtils: dateUtils,
	loginAndGoto: loginAndGoto,
	getToken: getToken,
	navigateBackDelay: navigateBackDelay,
	goPost: goPost,
	getLoginUserId: getLoginUserId
}
