window.onload = function() {
	var TITLE = '十大出彩河南公安人网络投票'
	var LINK = 'https://a.weixin.hndt.com/h5/hnga/index.html' //分享链接
	var IMG_URL = 'https://a.weixin.hndt.com/h5/hnga/icon-share.png'
	var DESC = '十大出彩河南公安人网络投票活动，小伙伴儿们快动动手指，为你心中的英雄投票吧！'

	//微信配置
	var href = window.location.href
	$.post('https://a.weixin.hndt.com/boom/at/sign', { url: href }, function(data) {
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
		})
	})

	wx.ready(function() {
		wx.onMenuShareTimeline({
			title: TITLE,
			link: LINK,
			imgUrl: IMG_URL,
			success: function() {},
			cancel: function() {}
		})
		wx.onMenuShareAppMessage({
			title: TITLE,
			desc: DESC,
			link: LINK,
			imgUrl: IMG_URL,
			type: '',
			dataUrl: '',
			success: function() {},
			cancel: function() {}
		})
	})
}
