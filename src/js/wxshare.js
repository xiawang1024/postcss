window.onload = function() {
	//微信配置
	var href = window.location.href;
	// alert(location.href.split('#')[0])
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
};
