!(function() {
	var voteId = '203c207c25fb41bfb8fe400b896b53ec'
	// var baseUrl = 'http://192.168.9.79:8080'
	var baseUrl = 'https://talk.hndt.com'
	var loading = weui.loading('加载中...')
	if (weChat.isPhone()) {
		// fastClick 消除click 300ms延迟
		if ('addEventListener' in document) {
			document.addEventListener(
				'DOMContentLoaded',
				function() {
					FastClick.attach(document.body)
				},
				false
			)
		}
	}

	if (!weChat.isWeiXin()) {
		new QRCode(document.getElementById('qrcode'), {
			text: window.location.href,
			width: 160,
			height: 160
		})
	}

	if (weChat.isWeiXin()) {
		var weChatCode = weChat.getQueryString('code')
		if (weChatCode) {
			getOpenId(weChatCode, function(data) {
				console.log(data)
			})
		}
	}
	function getOpenId(code, cb) {
		// if (!weChat.getStorage('WXHNDTOPENID')) {
		$.ajax({
			type: 'GET',
			url: 'https://a.weixin.hndt.com/boom/wx/access/subscribe',
			data: { code: code, state: 'wx5f789dea59c6c2c5', subscribe: false },
			dataType: 'json',
			timeout: 5000,
			success: function(data) {
				console.log(data)
				if (data.status == 'ok') {
					weChat.setStorage('WXHNDTOPENID', JSON.stringify(data.data))
					cb && cb(data.data)
				} else {
					window.location = weChat.redirectUrl()
				}
			},
			error: function(err) {
				console.log(err)
				window.location = weChat.redirectUrl()
			}
		})
		// }
	}

	//uuid生成
	// if (window.requestIdleCallback) {
	//   requestIdleCallback(function() {
	//     fingerHash()
	//   })
	// } else {
	//   setTimeout(function() {
	//     fingerHash()
	//   }, 500)
	// }
	var uuid = null
	function fingerHash() {
		Fingerprint2.get(function(components) {
			var murmur = Fingerprint2.x64hash128(
				components
					.map(function(pair) {
						return pair.value
					})
					.join(),
				31
			)
			uuid = murmur
			console.log(murmur)
		})
	}

	//个人信息
	// var url = 'https://api.hndt.com/api/page?template_id=357&article_id=' + weChat.getQueryString('id');

	var id = weChat.getQueryString('id')
	//http://a.weixin.hndt.com/h5/gdzy/data/201901/01/2286730/index.json
	var url = 'https://a.weixin.hndt.com/h5/gdzy/data/201901/10/' + id + '/index.json'
	// var url = 'http://192.168.9.41:3000/index.json'
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			loading.hide()
			toHtml(data)
			voteHandler(data.id)
		}
	})
	// 获取投票数
	refreshVote(id)
	//投票
	function voteHandler(id) {
		$('#vote-btn').click(function() {
			// var mobile = window.localStorage.getItem('mobile')
			var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'))
			if (!userInfo) {
				weui.alert('请在微信端打开投票！')
				return
			}
			var voteLoading = weui.loading('努力提交中...')

			$.ajax({
				type: 'post',
				url: baseUrl + '/dspdvote/tovote.do',
				dataType: 'json',
				data: {
					voteid: voteId,
					phone: userInfo.openid,
					itemid: id
				},
				success: function(data) {
					voteLoading.hide()
					var msg = data.message
					if (data.success) {
						refreshVote(id)
					}
					if (!data.result) {
						weui.alert(msg)
					} else {
						// weui.alert(msg, function() {

						// })
						$('#dialog').show()
					}
				},
				error: function(err) {
					console.log(err)
					voteLoading.hide()
					weui.alert('系统错误，请联系管理员！')
				}
			})
		})
	}
	//更新投票数
	function refreshVote(id) {
		//投票信息

		$.ajax({
			type: 'post',
			url: baseUrl + '/dspdvote/getvote.do',
			data: {
				voteid: voteId
			},
			dataType: 'json',
			success: function(res) {
				var data = res.result
				loading.hide()
				if (data) {
					var voteNum = data[id]
					if (!voteNum) {
						voteNum = 0
					}
				} else {
					voteNum = 0
				}
				$('.g-bd .ticket-num').html('票数：' + voteNum + '')
			},
			error: function(err) {
				console.log(err)
				loading.hide()
				weui.alert('系统错误，请联系管理员！')
			}
		})
	}
	//toHtml
	function toHtml(data) {
		$('.g-bd .avatar').attr('src', data.icon)
		$('.g-bd .name').html(data.title)
		$('.video').attr('src', data.video)
		var body = data.body.replace(/src/g, 'data')
		$('.g-bdc .content').html(body)
		// $('.g-bdc .content').html(data.body);
		setTimeout(function() {
			$('.content strong').css('color', '#2481c5')
			$('.content strong').eq(0).css('color', '#000')
		}, 20)
	}

	$('#signUp-btn').click(function() {
		var code = $('#code').val()
		var mobile = $('#mobile').val()
		if (!code) {
			weui.topTips('请输入验证码')
			return
		}
		$.ajax({
			type: 'post',
			url: baseUrl + '/dspdvote/verifycode.do',
			data: {
				voteid: voteId,
				phone: mobile,
				code: code
			},
			success: function(res) {
				if (res.success) {
					window.localStorage.setItem('mobile', mobile)
					$('#dialog').hide()
				} else {
					$('#code').val('')
				}
				weui.toast(res.message)
			}
		})
	})
	//验证码
	function fetchGetCode(mobile) {
		$.ajax({
			url: baseUrl + '/dspdvote/verify.do',
			type: 'post',
			data: {
				phone: mobile,
				voteid: voteId
			},
			success: function(res) {
				console.log(res)
				weui.toast(res.message)
				countDown()
			},
			error: function(err) {
				weui.alert('系统错误，请联系管理员！')
			}
		})
	}
	var isPostCode = false
	$('#get-code').click(function(e) {
		var mobile = $('#mobile').val()
		if (!mobile) {
			weui.topTips('请填写手机号')
			return
		}

		if (!isPostCode) {
			fetchGetCode(mobile)

			isPostCode = true
		} else {
			return
		}
	})

	function countDown() {
		var count = 20
		var timer = setInterval(function() {
			count--
			var codeText = '(' + count + ')s'
			$('#get-code').html(codeText)
			if (count == 0) {
				clearInterval(timer)
				isPostCode = false
				$('#get-code').html('获取验证码')
			}
		}, 1000)
	}
	$('.weui-mask').click(function() {
		$('#dialog').hide()
	})

	//drag
	var elem = document.querySelector('.draggable')
	var draggie = new Draggabilly(elem, {
		// options...
		containment: 'body'
	})
	var screenWidth = document.documentElement.clientWidth
	// var screenHeight = document.documentElement.clientHeight
	var screenHeight = $('.g-banner').height() + $('.g-hd').height()
	var logoBoxWidth = elem.offsetWidth + 10
	draggie.setPosition(screenWidth - logoBoxWidth, screenHeight + 80)
	draggie.on('dragEnd', function(event, pointer) {
		// var { pageX, pageY } = pointer
		var pageX = pointer.pageX
		var pageY = pointer.pageY
		if (pageX < screenWidth / 2) {
			draggie.setPosition(10, pageY)
		} else {
			draggie.setPosition(screenWidth - logoBoxWidth, pageY)
		}
	})
	draggie.on('staticClick', function() {
		window.location = 'https://a.weixin.hndt.com/h5/gdzy/prize/index.html'
	})
})()
