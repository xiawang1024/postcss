!(function() {
	var app = new Vue({
		el: '#app',
		data: {
			userInfo: {
				nickname: '冰糖先生',
				headimgurl:
					'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eroqJEibh9fzG5BI9lKXRkE6xrNBjibNaXAOEu4faqcQwUibicL0dzicYECeTVJibsGmvichvTTnUQScdUtg/132'
			},
			songList: [],
			showSongList: [],
			audioSrc: '',
			tabIndex: 1,
			playIndex: -1
		},
		created: function() {},
		mounted: function() {
			this.audio = document.getElementById('audio');
		},
		methods: {
			getSongs: function(openId) {
				openId = 'oaYgpwOCN8OE1moSxalrwnU_NN94';
				$.ajax({
					type: 'get',
					url: 'http://a.weixin.hndt.com/boom/api/wx/radio/list?openId=' + openId,
					success: function(data) {
						if (data.status == 'ok') {
							app.songList = data.data;
							app.showSong(1);
						} else {
							weui.alert('暂未录制上传歌曲！');
						}
					}
				});
			},
			getUser: function(data) {
				app.userInfo = data;
			},
			playSong: function(src, index) {
				if (app.playIndex != index) {
					app.audioSrc = src;

					setTimeout(function() {
						app.playIndex = index;
						this.audio.play();
					}, 20);
				} else {
					if (!this.audio.paused) {
						setTimeout(function() {
							app.playIndex = -1;
							this.audio.pause();
						}, 20);
					} else {
						setTimeout(function() {
							app.playIndex = index;
							this.audio.play();
						}, 20);
					}
				}
			},
			tabSwitch: function(index) {
				this.audio.pause();
				app.playIndex = -1;
				app.tabIndex = index;
				app.showSong(index);
			},
			showSong: function(index) {
				app.showSongList = app.songList.filter(function(item) {
					return item.status == index;
				});
			}
		}
	});
	app.getSongs();
	//微信code

	var weChatCode = weChat.getQueryString('code');
	if (weChatCode) {
		getOpenId(weChatCode, function(data) {
			app.getUser(data);
			app.getSongs(data.openid);
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

	var data = [
		{ value: '01', label: '爱我中华' },
		{ value: '02', label: '不忘初心' },
		{ value: '03', label: '草原上升起不落的太阳' },
		{ value: '04', label: '唱支山歌给党听' },
		{ value: '05', label: '春天的故事' },
		{ value: '06', label: '党啊,亲爱的党' },
		{ value: '07', label: '歌唱祖国' },
		{ value: '08', label: '红旗飘飘' },
		{ value: '09', label: '红星照我去战斗' },
		{ value: '10', label: '洪湖水浪打浪' },
		{ value: '11', label: '解放区的天' },
		{ value: '12', label: '没有共产党就没有新中国' },
		{ value: '13', label: '美丽的中国梦' },
		{ value: '14', label: '七月的鲜花献给党' },
		{ value: '15', label: '亲爱的中国我爱你' },
		{ value: '16', label: '少年中国' },
		{ value: '17', label: '十送红军' },
		{ value: '18', label: '松花江上' },
		{ value: '19', label: '颂歌献给亲爱的党' },
		{ value: '20', label: '童心向党' },
		{ value: '21', label: '团结就是力量' },
		{ value: '22', label: '我爱你中国' },
		{ value: '23', label: '我的中国心' },
		{ value: '24', label: '我的祖国' },
		{ value: '25', label: '五星红旗' },
		{ value: '26', label: '绣红旗' },
		{ value: '27', label: '映山红' },
		{ value: '28', label: '永远跟党走' },
		{ value: '29', label: '知心的话儿对党说' },
		{ value: '30', label: '走进新时代' }
	];

	$('#selectSong').click(function() {
		var _this = $(this);
		weui.picker(data, {
			defaultValue: [ 1 ],
			onConfirm: function(result) {
				_this.data('id', result[0].value);
				_this.html(result[0].label);
			}
		});
	});

	if (!localStorage.rainAllowRecord || localStorage.rainAllowRecord !== 'true') {
		wx.startRecord({
			success: function() {
				localStorage.rainAllowRecord = 'true';
				wx.stopRecord();
			},
			cancel: function() {
				alert('用户拒绝授权录音');
			}
		});
	}

	var START = 0,
		END = 0,
		recordTimer;
	$('#talk_btn').on('touchstart', function(event) {
		event.preventDefault();
		START = Date.parse(new Date());
		if (!$('#selectSong').data('id')) {
			weui.topTips('请先选择歌曲！');

			return;
		}

		$(this).html('松开停止录音');

		recordTimer = setTimeout(function() {
			wx.startRecord({
				success: function() {
					localStorage.rainAllowRecord = 'true';
				},
				cancel: function() {
					alert('用户拒绝授权录音');
				}
			});
		}, 300);
	});
	//松手结束录音
	$('#talk_btn').on('touchend', function(event) {
		event.preventDefault();
		END = Date.parse(new Date());
		$(this).html('按住开始录音');
		if (!$('#selectSong').data('id')) {
			weui.topTips('请先选择歌曲！');

			return;
		}
		//2秒内不录音
		if (END - START < 2000) {
			END = 0;
			START = 0;
			weui.alert('时间过短，请重新录制！');
			//小于2000ms，不录音
			clearTimeout(recordTimer);
			return;
		} else {
			wx.stopRecord({
				success: function(res) {
					var voiceLocalId = res.localId;
					wx.playVoice({
						localId: voiceLocalId // 需要播放的音频的本地ID，由stopRecord接口获得
					});

					weui.confirm('回听已录制的歌曲', {
						buttons: [
							{
								label: '重新录制',
								type: 'default',
								onClick: function() {
									console.log('no');
								}
							},
							{
								label: '确定上传',
								type: 'primary',
								onClick: function() {
									uploadVoice(voiceLocalId);
								}
							}
						]
					});
				},
				fail: function(res) {
					console.log(JSON.stringify(res));
				}
			});
		}
	});
	//上传录音
	function uploadVoice(voiceLocalId) {
		//调用微信的上传录音接口把本地录音先上传到微信的服务器
		//不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
		wx.uploadVoice({
			localId: voiceLocalId, // 需要上传的音频的本地ID，由stopRecord接口获得
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function(res) {
				var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'));

				var openId = userInfo.openid;
				var username = userInfo.nickname || '';
				var icon = userInfo.headimgurl || '';
				var songName = $('#selectSong').html();
				//把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
				$.ajax({
					url: 'https://a.weixin.hndt.com/boom/api/wx/radio/download',
					type: 'get',
					data: { mediaId: res.serverId, openId: openId, name: songName, username: username, icon: icon },
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
})();
