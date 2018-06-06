if ('addEventListener' in document) {
	document.addEventListener(
		'DOMContentLoaded',
		function() {
			FastClick.attach(document.body);
		},
		false
	);
}

(function() {
	//播放
	var audio = document.getElementById('audio');
	var playBtn = document.getElementById('playOrPause');
	$(playBtn).click(function() {
		var isPlay = $(this).hasClass('active');
		if (!isPlay) {
			$(this).addClass('active');
			play();
		} else {
			$(this).removeClass('active');
			pause();
		}
	});
	function play() {
		audio.play();
	}
	function pause() {
		audio.pause();
	}

	//评论
	$('#sendMsg').click(function() {
		var comment = $('#comment').val();
		if (!comment) {
			weui.alert('内容不能为空');
		} else {
			var loading = weui.loading('提交中...');
			getUser(function(userInfo) {
				postMsg(userInfo, function() {
					loading.hide();
					weui.toast('评论成功，等待审核！');
					$('#comment').val('');
				});
			});
		}
	});
	var CID = '1001';
	function getUser(cb) {
		var userInfo = {};
		var openId = getQueryString('openId');

		$.ajax({
			type: 'get',
			url: 'http://a.weixin.hndt.com/user/find/openid?openid=' + openId,
			dataType: 'json',
			success: function(data) {
				if (data.status == 1) {
					userInfo.creater = data.data.name;
					userInfo.fromUid = data.data.id;
					cb && cb(userInfo);
				} else {
					console.log('error');
				}
			}
		});
	}
	function postMsg(userInfo, cb) {
		var content = $('#comment').val();
		var postData = {
			page: '0',
			cid: CID,
			creater: userInfo.creater || '',
			fromUid: userInfo.fromUid || '',
			content: content
		};
		$.ajax({
			type: 'post',
			url: 'http://talk.hndt.com/test/upRadio.do',
			data: postData,
			success: function(data) {
				cb && cb();
			}
		});
	}
	var page = 1;
	getComment(function(data) {
		var list = data.list;
		result = toHtml(list);
		$('.comment-list .list-wrap').append(result);
	});
	function getComment(cb) {
		var loading0 = weui.loading('努力加载中...');
		$.ajax({
			type: 'post',
			url: 'http://talk.hndt.com/test/upRadio.do',
			data: { page: page, cid: CID },
			success: function(data) {
				loading0.hide();
				if (data.result) {
					cb && cb(data.result);
				} else {
					weui.alert('没有更多数据！');
				}
			}
		});
	}
	function getQueryString(query) {
		var qs = location.search.substr(1), // 获取url中"?"符后的字串
			args = {}, // 保存参数数据的对象
			items = qs.length ? qs.split('&') : [], // 取得每一个参数项,
			item = null,
			len = items.length;

		for (var i = 0; i < len; i++) {
			item = items[i].split('=');
			var name = decodeURIComponent(item[0]),
				value = decodeURIComponent(item[1]);
			if (name) {
				args[name] = value;
			}
		}
		return args[query];
	}
	//点赞
	$('.g-bd .m-comment .comment-list .list .zan').click(function() {
		toast('点赞成功！');
	});

	//查看更多
	$('.g-bd .m-comment .comment-list .u-see-more').click(function() {
		page++;
		var result = '';
		getComment(function(data) {
			var list = data.list;
			result = toHtml(list);
			$('.comment-list .list-wrap').append(result);
		});
	});

	function toHtml(list) {
		var html = '';
		for (var i = 0; i < list.length; i++) {
			var item = list[i].comment;
			html +=
				'<li class="list">' +
				'   <div class="avatar-wrap">' +
				'       <img src="' +
				item.icon +
				'" alt="" class="img">' +
				'   </div>' +
				'   <div class="text-wrap">' +
				'       <div class="cont-wrap">' +
				'           <span class="name">' +
				item.creater +
				'：</span>' +
				'           <p class="cont">' +
				item.content +
				'</p>' +
				'       </div>' +
				'       <div class="other-wrap clearfix">' +
				'           <span class="time">' +
				parseDate(item.create_time) +
				'</span>' +
				'       </div>' +
				'   </div>' +
				' </li>';
		}

		return html;
	}
	function parseDate(nS) {
		return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
	}
})();
