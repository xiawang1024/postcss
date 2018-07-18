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

	//判断是否是微信客户端打开
	if (weChat.isWeiXin()) {
		var weChatCode = weChat.getQueryString('code');
		if (weChatCode) {
			getOpenId(weChatCode, function(data) {
				console.log(data);
			});
		}
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
	}

	// 填充列表
	$.ajax({
		type: 'GET',
		url: 'https://a.weixin.hndt.com/h5/2018dianshang/data/index.json',
		dataType: 'json',
		success: function(data) {
			$.ajax({
				type: 'GET',
				url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteshowlist',
				dataType: 'json',
				success: function(voteList) {
					var newList = resetList(data, voteList);
					listToHtml(newList);
					loading.hide();
				}
			});
		},
		error: function(err) {
			console.log(err);
			loading.hide();
			weui.alert('网络错误');
		}
	});
	function resetList(list, voteList) {
		var len = list.length;

		for (key in voteList) {
			for (var i = 0; i < len; i++) {
				var item = list[i];
				// console.log(item.id, key);
				// console.log(item.id == key);
				if (item.id == key) {
					item.vote = voteList[key];
					break;
				} else {
					item.vote = 0;
				}
			}
		}
		// console.log(list);
		return list;
	}
	function listToHtml(list) {
		var listWrap = $('.g-bd .list-wrap');
		var len = list.length;
		var html = '';
		for (var i = 0; i < len; i++) {
			var item = list[i];
			// html +=
			// 	'<li class="list">' +
			// 	'                <div class="avatar-wrap">' +
			// 	'                    <img src="' +
			// 	item.icon +
			// 	'" alt="" class="avatar">' +
			// 	'                </div>' +
			// 	'                <div class="text-wrap">' +
			// 	'                    <h3 class="name">' +
			// 	item.title +
			// 	'</h3>' +
			// 	'                    <a href="https://a.weixin.hndt.com/h5/2018dianshang/vote/index.html?id=' +
			// 	item.id +
			// 	'" class="link">' +
			// 	'                        <span class="icon"></span>' +
			// 	'                        <span class="text">投票</span>' +
			// 	'                    </a>' +
			// 	'                </div>' +
			// 	'            </li>';

			html +=
				'<li class="list">' +
				'                <div class="avatar-wrap">' +
				'                    <img src="' +
				item.icon +
				'" alt="" class="avatar">' +
				'                </div>' +
				'                <div class="text-wrap">' +
				'                    <h3 class="name">' +
				item.title +
				'</h3>' +
				'                    <div class="ticket-wrap">' +
				'                        <span class="ticket-num">票数:' +
				item.vote +
				'</span>' +
				'                    </div>' +
				'                    <a href="https://a.weixin.hndt.com/h5/2018dianshang/vote/index.html?id=' +
				item.id +
				'" class="link">' +
				'                        <span class="icon"></span>' +
				'                        <span class="text">投票</span>' +
				'                    </a>' +
				'                </div>' +
				'            </li>';
		}
		listWrap.html(html);
	}
})();
