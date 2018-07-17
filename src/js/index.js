!(function() {
	var loading = weui.loading('加载中...');
	if (weChat.isPhone()) {
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
	}

	if (!weChat.isWeiXin()) {
		new QRCode(document.getElementById('qrcode'), {
			text: window.location.href,
			width: 160,
			height: 160
		});
	}

	var weChatCode = weChat.getQueryString('code');
	if (weChatCode) {
		getOpenId(weChatCode, function(data) {
			console.log(data);
		});
	}
	function getOpenId(code, cb) {
		// if (!weChat.getStorage('WXHNDTOPENID')) {
		$.ajax({
			type: 'GET',
			url: 'https://a.weixin.hndt.com/boom/api/token/access/redirect2',
			data: { code: code, cate: 'wx5f789dea59c6c2c5' },
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if (data.status == 'ok') {
					weChat.setStorage('WXHNDTOPENID', JSON.stringify(data.data));
					cb && cb(data.data);
				} else {
					window.location = weChat.redirectUrl();
				}
			},
			error: function(err) {
				console.log(err);
				window.location = weChat.redirectUrl();
			}
		});
		// }
	}

	//个人信息
	$.ajax({
		type: 'GET',
		url: 'https://api.hndt.com/api/page?template_id=357&article_id=' + weChat.getQueryString('id'),
		dataType: 'json',
		success: function(data) {
			toHtml(data);
			//视频播放
			loading.hide();

			//投票
			$('#vote-btn').click(function() {
				var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'));
				if (!userInfo) {
					weui.alert('请打开微信投票！');
					return;
				}
				var voteLoading = weui.loading('努力提交中...');
				$.ajax({
					type: 'POST',
					url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteadd',
					dataType: 'json',
					data: {
						title: data.title,
						ref: 'https://a.weixin.hndt.com/h5/2018dianshang/vote/index.html?id=' + data.id,
						openId: userInfo.openid,
						mobile: '',
						userId: '',
						id: data.id
					},
					success: function(data) {
						if (data.status == 'ok') {
							//投票信息
							$.ajax({
								type: 'post',
								url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteshow',
								data: {
									id: weChat.getQueryString('id')
								},
								dataType: 'json',
								success: function(data) {
									$('.g-bd .ticket-num').html('票数：' + data.data + '');
								},
								error: function(err) {
									console.log(err);
								}
							});
							voteLoading.hide();
							weui.toast('投票成功！');
						} else {
							voteLoading.hide();
							weui.toast('投票失败！今日投票次数用完，明日再投！');
						}
					}
				});
			});

			$('#video-play').click(function() {
				document.getElementById('video').play();
				$(this).hide();
			});
		},
		error: function(err) {
			console.log(err);
		}
	});

	function toHtml(data) {
		$('.g-bd .avatar').attr('src', data.icon);
		$('.g-bd .name').html(data.title);
		$('.video').attr('src', data.video);
		$('.g-bdc .content').html(data.body);
	}

	//投票信息
	$.ajax({
		type: 'post',
		url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteshow',
		data: {
			id: weChat.getQueryString('id')
		},
		dataType: 'json',
		success: function(data) {
			$('.g-bd .ticket-num').html('票数：' + data.data + '');
		},
		error: function(err) {
			console.log(err);
		}
	});
})();
