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

	//微信code
	var weChatCode = weChat.getQueryString('code');
	if (weChatCode) {
		getOpenId(weChatCode);
	}
	function getOpenId(code) {
		// if (!weChat.getStorage('WXHNDTOPENID')) {
		$.ajax({
			type: 'GET',
			url: 'http://mp.weixin.hnrtvcloud.com/api/token/access/redirect2',
			data: { code: code, cate: weChatConf.appId },
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if (data.status == 'ok') {
					weChat.setStorage('WXHNDTOPENID', JSON.stringify(data.data));
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

	//都市KTV 参数
	var GET_MSG_LIST_TIME = 50000;
	var VOTE_REFRESH_TIME = 5000;
	var HU_DONG_ID = 2000;

	//弹幕系统

	var page = 1;
	getMsgList(page, function(data) {
		console.log(data);
		if (data) {
			shootMsg(data);
		}
	});
	clearInterval(listTimerId); //TODO: clear
	var listTimerId = setInterval(function() {
		getMsgList(page, function(data) {
			console.log(data);
			if (data) {
				shootMsg(data);
			}
		});
	}, GET_MSG_LIST_TIME);
	var barrage = new DanMa('barrage', 'danma', 9);

	// 弹幕发射
	$('#sendBtn').click(function() {
		var sendMsg = $('#sendMsg').val();
		if (!sendMsg) {
			weui.topTips('请输入内容！谢谢');
			return;
		}
		//假象发送
		barrage.emit({
			text: $('#sendMsg').val().trim(),
			color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
			font: '12px'
		});
		var content = $('#sendMsg').val().trim();
		$('#sendMsg').val('');
		//真实提交
		var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'));
		$.ajax({
			type: 'get',
			url: 'http://a.weixin.hndt.com/user/find/openid?openid=' + userInfo.openid,
			dataType: 'json',
			success: function(data) {
				if (data.status == 1) {
					$.ajax({
						type: 'post',
						url: 'http://talk.hndt.com/test/upRadio.do',
						data: {
							page: 0,
							cid: HU_DONG_ID,
							creater: data.data.name,
							fromUid: data.data.id,
							content: content
						}
					});
				} else {
					console.log('get userinfo failed');
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	});

	function shootMsg(list) {
		var i = 0;
		var timerId = setInterval(function() {
			if (list[i]) {
				barrage.emit({
					text: list[i].comment.content,
					color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
					font: '12px'
				});
			} else {
				i = 0;
				clearInterval(timerId);
			}
			i++;
		}, 1500);
	}

	//取得弹幕消息
	function getMsgList(page, cb) {
		$.ajax({
			type: 'post',
			url: 'http://talk.hndt.com/test/upRadio.do',
			data: {
				page: page,
				cid: HU_DONG_ID,
				creater: '',
				fromUid: '',
				content: ''
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.result) {
						cb && cb(data.result.list);
					} else {
						cb && cb(false);
						console.log('没有更多评论');
					}
				} else {
					console.log('error');
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	//活动规则
	$('#icon-rule').click(function() {
		weui.alert('<h1>游戏规则</h1><h1>游戏规则</h1><h1>游戏规则</h1>');
	});

	//投票
	$('.m-info .m-user .u-btn').click(function() {});

	//获取正在进行的活动信息
	getActiveInfo(false);
	//刷新vote百分比
	// setInterval(function() {
	// 	getActiveInfo(false);
	// }, 5000);
	var ingActiveInfo = {};
	function weiShare(title, desc) {
		var LINK = 'http://mp.weixin.hnrtvcloud.com/h5/index.html';
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
	function getActiveInfo(onlyVote) {
		$.ajax({
			type: 'get',
			url: 'http://mp.weixin.hnrtvcloud.com/api/battle/active',
			dataType: 'json',
			success: function(data) {
				console.log(data);
				setTimeout(function() {
					loading.hide();
				}, 20);
				if (data.status == 0) {
					console.log('进行中');
				} else {
					console.log('结束');
					weui.alert('本期已结束，谢谢关注！');
					setTimeout(function() {
						window.location.href = 'http://mp.weixin.hnrtvcloud.com/h5/notice/index.html';
					}, 1000);
				}
				weiShare(data.previewTitle, data.description);
				selectBattle(data, function(isBattleIng) {
					console.log(ingActiveInfo);
					voteHandler();
					refreshInfo();
					console.log(isBattleIng);
					voteRefresh();
				});
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	function selectBattle(data, cb) {
		var battleList = data.battleSessionList;
		var ingBattle = battleList.filter(function(item, index) {
			return item.voteStatus === 0;
		});
		ingActiveInfo.id = data.id;
		$('.g-hd .m-title').html(data.previewTitle);
		if (ingBattle && ingBattle.length > 0) {
			insertHtml(ingBattle[0]);
			votePercent(ingBattle[0]);
			ingActiveInfo.sid = ingBattle[0].id;
			ingActiveInfo.firstManNo = ingBattle[0].firstManNo;
			ingActiveInfo.secondManNo = ingBattle[0].secondManNo;
		} else {
			insertHtml(battleList[0]);
			votePercent(battleList[0]);
			ingActiveInfo.sid = battleList[0].id;
		}
		var isBattleIng = !!(ingBattle && ingBattle.length > 0);
		console.log(ingActiveInfo);
		console.log(ingBattle);
		cb && cb(isBattleIng);
	}
	function insertHtml(info) {
		var firstMan = $('.m-info .m-user').eq(0);
		var secondMan = $('.m-info .m-user').eq(1);
		firstMan.find('.avatar').attr('src', info.firstManIcon);
		secondMan.find('.avatar').attr('src', info.secondManIcon);
		firstMan.find('.u-name span').html(info.firstManName);
		secondMan.find('.u-name span').html(info.secondManName);
	}

	function votePercent(info) {
		console.log('onlyVote');
		var percentEle = $('.m-percent');
		var percentProgress = $('.m-progress-wrap');
		percentEle.find('.u-owner-percent').html(info.firstVotePercent + '%');
		percentEle.find('.u-challenge-percent').html(info.secondVotePercent + '%');
		percentProgress.find('.u-owner').css('width', info.firstVotePercent + '%');
		percentProgress.find('.u-challenge').css('width', info.secondVotePercent + '%');
	}
	//投票率刷新服务

	function voteRefresh() {
		clearInterval(timerId);
		var timerId = setInterval(function() {
			$.ajax({
				type: 'get',
				url:
					'http://mp.weixin.hnrtvcloud.com/api/battle/voteshow?id=' +
					ingActiveInfo.id +
					'&sid=' +
					ingActiveInfo.sid,
				dataType: 'json',
				success: function(data) {
					console.log(data);
					if (data.status === 'ok') {
						votePercentRefresh(data.data);
					} else {
						console.log('votePercentRefresh failed');
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}, VOTE_REFRESH_TIME);
	}
	function votePercentRefresh(info) {
		var percentEle = $('.m-percent');
		var percentProgress = $('.m-progress-wrap');
		percentEle.find('.u-owner-percent').html(info.countFirst + '%');
		percentEle.find('.u-challenge-percent').html(info.countSecond + '%');

		percentProgress.find('.u-owner').css('width', info.countFirst + '%');
		percentProgress.find('.u-challenge').css('width', info.countSecond + '%');
	}
	//刷新服务
	function refreshInfo() {
		$('#refresh-btn').off();
		$('#refresh-btn').on('click', function() {
			$.ajax({
				type: 'get',
				url:
					'http://mp.weixin.hnrtvcloud.com/api/battle/refresh?id=' +
					ingActiveInfo.id +
					'&sid=' +
					ingActiveInfo.sid,
				dataType: 'json',
				success: function(data) {
					console.log(data);
					if (data.status === 'ok') {
						getActiveInfo(false);
					} else {
						weui.alert(data.msg);
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		});
	}

	//投票
	function voteHandler() {
		$('.m-info .m-user .u-btn').off();
		$('.m-info .m-user .u-btn').on('click', function() {
			var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'));
			var number = null;
			// weui.alert(userInfo.id);
			console.log(typeof $(this).data('order'));
			if ($(this).data('order') === 0) {
				number = ingActiveInfo.firstManNo;
			} else {
				number = ingActiveInfo.secondManNo;
			}
			$.ajax({
				type: 'post',
				url: 'http://mp.weixin.hnrtvcloud.com/api/battle/voteadd',
				data: {
					openId: userInfo.openid,
					mobile: '',
					userId: userInfo.id,
					id: ingActiveInfo.id,
					sid: ingActiveInfo.sid,
					number: number
				},
				dataType: 'json',
				success: function(data) {
					console.log(ingActiveInfo);
					weui.alert(data.msg);
				},
				error: function(err) {
					console.log(err);
				}
			});
		});
	}
})();
