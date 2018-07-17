!(function() {
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

	//填充列表
	$.ajax({
		type: 'GET',
		url: 'https://api.hndt.com/api/page?template_id=356&channel_id=1441',
		dataType: 'json',
		success: function(data) {
			listToHtml(data);
		}
	});
	function listToHtml(list) {
		var listWrap = $('.g-bd .list-wrap');
		var len = list.length;
		var html = '';
		for (var i = 0; i < len; i++) {
			var item = list[i];
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
