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
				weiShare(data.previewTitle, data.description);
				selectBattle(data, function(isBattleIng) {
					console.log(ingActiveInfo);
					voteHandler();
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
})();
