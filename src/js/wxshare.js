window.onload = function() {
	var TITLE = '给党唱支生日歌--庆祝中国共产党建党97周年';
	var LINK = ''; //分享链接
	var IMG_URL = 'http://www.hndt.com/h5/partysday/PartysDay.jpg';
	var DESC = '庆祝中国共产党建党97周年--大型系列文化活动！';

	//微信配置
	var href = window.location.href;
	$.post('https://a.weixin.hndt.com/at/sign', { url: href }, function(data) {
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'chooseImage',
				'previewImage',
				'startRecord',
				'playVoice',
				'stopRecord',
				'downloadVoice',
				'uploadVoice',
				'stopVoice',
				'openLocation'
			]
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
