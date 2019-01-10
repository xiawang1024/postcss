window.onload = function() {
	var TITLE = '十大出彩河南公安人物网络投票'
	var LINK = 'https://a.weixin.hndt.com/h5/hnga/detail/index.html?id=' + weChat.getQueryString('id') //分享链接
	var IMG_URL = 'https://a.weixin.hndt.com/h5/hnga/icon-share.png'
	var DESC = '十大出彩河南公安人物网络投票'

	var url = 'https://a.weixin.hndt.com/h5/hnga/data/201901/10/' + weChat.getQueryString('id') + '/index.json'
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		success: function(data) {
			TITLE = '请为我投票--' + data.title
		},
		error: function(err) {
			console.log(err)
			weui.alert('系统错误，请联系管理员')
		}
	})
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
				'getLocation',
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
