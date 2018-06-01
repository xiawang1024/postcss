window.onload = function() {
	var TITLE = '河南广播网2018春节特别报道';
	var LINK = ''; //分享链接
	var IMG_URL = 'http://hndt.com/res/logo_300.png';
	var DESC = '河南广播网2018春节特别报道--我们的节日！';

	//微信配置
	var href = window.location.href;
	$.post('https://a.weixin.hndt.com/at/sign', { url: href }, function(data) {
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage' ]
		});
	});

	wx.ready(function() {
		wx.onMenuShareTimeline({
			title: TITLE,
			link: LINK,
			imgUrl: IMG_URL,
			success: function() {},
			cancel: function() {}
		});
		wx.onMenuShareAppMessage({
			title: TITLE,
			desc: DESC,
			link: LINK,
			imgUrl: IMG_URL,
			type: '',
			dataUrl: '',
			success: function() {},
			cancel: function() {}
		});
	});
};
