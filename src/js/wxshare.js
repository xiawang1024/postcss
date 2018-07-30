window.onload = function() {
	var TITLE = '都市KTV';
	var LINK = 'http://mp.weixin.hnrtvcloud.com/h5/index.html'; //分享链接
	var IMG_URL = 'http://mp.weixin.hnrtvcloud.com/img/logo.png';
	var DESC = '都市KTV';

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

	// wx.ready(function() {
	// 	wx.onMenuShareTimeline({
	// 		title: TITLE,
	// 		link: LINK,
	// 		imgUrl: IMG_URL,
	// 		success: function() {},
	// 		cancel: function() {}
	// 	});
	// 	wx.onMenuShareAppMessage({
	// 		title: TITLE,
	// 		desc: DESC,
	// 		link: LINK,
	// 		imgUrl: IMG_URL,
	// 		type: '',
	// 		dataUrl: '',
	// 		success: function() {},
	// 		cancel: function() {}
	// 	});

	// 	wx.onVoiceRecordEnd({
	// 		// 录音时间超过一分钟没有停止的时候会执行 complete 回调
	// 		complete: function(res) {
	// 			var localId = res.localId;
	// 			wx.playVoice({
	// 				localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
	// 			});
	// 			weui.confirm('回听已录制的歌曲', {
	// 				buttons: [
	// 					{
	// 						label: '重新录制',
	// 						type: 'default',
	// 						onClick: function() {
	// 							console.log('no');
	// 						}
	// 					},
	// 					{
	// 						label: '确定上传',
	// 						type: 'primary',
	// 						onClick: function() {
	// 							uploadVoice(localId);
	// 						}
	// 					}
	// 				]
	// 			});
	// 		}
	// 	});
	// });
	function uploadVoice(voiceLocalId) {
		//调用微信的上传录音接口把本地录音先上传到微信的服务器
		//不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
		wx.uploadVoice({
			localId: voiceLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function(res) {
				var userInfo = weChat.getStorage('WXHNDTOPENID');
				var openId = JSON.parse(userInfo).openid;
				var songName = $('#selectSong').html();
				//把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
				$.ajax({
					url: 'https://a.weixin.hndt.com/boom/api/wx/radio/download',
					type: 'get',
					data: { mediaId: res.serverId, openId: openId, name: songName },
					dataType: 'json',
					success: function(data) {
						weui.toast('上传成功！');
					},
					error: function(xhr, errorType, error) {
						console.log(error);
					}
				});
			}
		});
	}
};
