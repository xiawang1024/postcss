!(function() {
	// fastClick 消除click 300ms延迟
	if ('addEventListener' in document) {
		document.addEventListener(
			'DOMContentLoaded',
			function() {
				FastClick.attach(document.body);
			},
			false
		);
	}
	var loading = weui.loading('努力加载中...');
	document.body.addEventListener('touchstart', function() {
		console.log(':active');
	});

	//获取正在进行的活动信息
	getActiveInfo(false);

	function weiShare(title, desc) {
		var LINK = 'http://mp.weixin.hnrtvcloud.com/h5/notice/index.html';
		var IMG_URL = 'http://mp.weixin.hnrtvcloud.com/img/logo.png';
		wx.ready(function() {
			wx.onMenuShareTimeline({
				title: title,
				link: LINK,
				imgUrl: IMG_URL,
				success: function() {},
				cancel: function() {}
			});
			wx.onMenuShareAppMessage({
				title: title,
				desc: desc,
				link: LINK,
				imgUrl: IMG_URL,
				type: '',
				dataUrl: '',
				success: function() {},
				cancel: function() {}
			});
		});
	}
	var isStart = false;

	function getActiveInfo(onlyVote) {
		$.ajax({
			type: 'get',
			url: 'http://mp.weixin.hnrtvcloud.com/api/battle/active',
			dataType: 'json',
			success: function(data) {
				if (data.status == 0) {
					$('#tips').html('活动正在进行，为您跳转中...');
					setTimeout(function() {
						window.location.href = 'http://mp.weixin.hnrtvcloud.com/h5/index.html';
					}, 1500);
				}
				setTimeout(function() {
					loading.hide();
				}, 20);
				weiShare(data.previewTitle, data.description);
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	/**
 * 获取几天后的日期
 * @param {Number} AddDayCount 
 */
	function GetDateStr(AddDayCount, time) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
		var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
		return y + '-' + m + '-' + d + ' ' + time;
	}
	/**
 * ios android 获取时间戳兼容写法
 * @param {*} date 
 * @param {*} time 
 */
	function formatTimeStamp(date) {
		var dateStr = date;
		var iosDateStr = date.replace(/-/g, '/');
		return Date.parse(new Date(dateStr)) || Date.parse(new Date(iosDateStr));
	}
	/**
 * 获取今天周几
 */
	function GetWeek() {
		var day = new Date().getDay();
		return day === 0 ? 7 : day;
	}
	/**
 * 倒计时开始
 * @param {Number} week 周几开始
 * @param {String} time 开始时间点
 * @param {Number} time 间隔天数限制
 */
	function init(week, time, n) {
		var interval = week - GetWeek();
		if (interval >= 0) {
			var endTime = GetDateStr(interval, time);
			var endTimeStamp = formatTimeStamp(endTime);
			var nowTimeStamp = new Date().getTime();
			var intervalStamp = endTimeStamp - nowTimeStamp;
			var oneDayStamp = n * 24 * 60 * 60 * 1000;

			if (nowTimeStamp <= endTimeStamp) {
				if (intervalStamp <= oneDayStamp) {
					console.log('显示倒计时');
					$('#tips').html('距离活动开始还有');
					Tick(endTimeStamp);
				} else {
					console.log('隐藏倒计时');
					$('#tips').hide();
				}
			} else {
				$('#tips').hide();
				return;
			}
		} else {
			console.log('隐藏倒计时');
			$('#tips').hide();
			return;
		}
	}
	/**
 * 倒计时插件
 * @param {Number} endTimeStamp 
 */
	function Tick(endTimeStamp) {
		Tictac.init({
			currentTime: new Date().getTime(), //设置当前时间
			interval: 3000, //执行callback的时间间隔
			callback: function() {
				//重复执行的回调
			}
		});
		console.log(endTimeStamp);
		Tictac.create('tick', {
			targetId: 'tick', //显示计时器的容器
			expires: endTimeStamp, //目标时间
			format: {
				//格式化对象
				days: '{d}天 ',
				hours: '{hh}小时 ',
				minutes: '{mm}分 ',
				seconds: '{ss}秒'
			},
			timeout: function() {
				//计时器 timeout 回调
				console.log('start');
				$('#tips').html('活动正在进行，为您跳转中...');
				setTimeout(function() {
					window.location.href = 'http://mp.weixin.hnrtvcloud.com/h5/index.html';
				}, 1500);
			}
		});
	}

	/**
	* 倒计时初始化
	*/
	init(7, '21:40:00', 7);
})();
