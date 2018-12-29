!(function() {
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

  // if (!weChat.isWeiXin()) {
  //   new QRCode(document.getElementById('qrcode'), {
  //     text: window.location.href,
  //     width: 160,
  //     height: 160
  //   })
  // }

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
  var url =
    'https://a.weixin.hndt.com/h5/2018dianshang/data/' +
    weChat.getQueryString('id') +
    '.json'
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
  //投票
  function voteHandler(id) {
    $('#vote-btn').click(function() {
      // var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'))
      // if (!userInfo) {
      //   weui.alert('请打开微信投票！')
      //   return
      // }
      var mobile = window.localStorage.getItem('mobile')
      if (!mobile) {
        $('#dialog').show()
        return
      }
      var voteLoading = weui.loading('努力提交中...')

      // var appId = 'wx5f789dea59c6c2c5',
      //   voteId = 3
      // var openId = userInfo.openid

      $.ajax({
        type: 'POST',
        url: 'https://a.weixin.hndt.com/boom/openapi/vote/log/add',
        dataType: 'json',
        timeout: 5000,
        data: {},
        success: function(data) {
          voteLoading.hide()
          var msg = data.msg
          if (data.status == 'ok') {
            weui.alert(msg)
            refreshVote(id)
          } else if (data.status == 'warn') {
            weui.alert(msg)
          } else {
            weui.alert(msg)
          }
        },
        error: function(err) {
          console.log(err)
          voteLoading.hide()
          weui.alert('网络错误！')
        }
      })
    })
  }
  //更新投票数
  function refreshVote(id) {
    //投票信息
    var voteId = 3
    $.ajax({
      type: 'get',
      url:
        'https://a.weixin.hndt.com/boom/openapi/vote/log/show/' +
        voteId +
        '/' +
        id,
      dataType: 'json',
      success: function(data) {
        $('.g-bd .ticket-num').html('票数：' + data + '')
      },
      error: function(err) {
        console.log(err)
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
      $('.content strong')
        .eq(0)
        .css('color', '#000')
    }, 20)
  }

  // 更新投票数
  $.ajax({
    type: 'get',
    url:
      'https://a.weixin.hndt.com/boom/openapi/vote/log/show/3/' +
      weChat.getQueryString('id'),

    dataType: 'json',
    timeout: 10000,
    success: function(data) {
      loading.hide()
      if (!data) {
        data = 0
      }
      $('.g-bd .ticket-num').html('票数：' + data + '')
    },
    error: function(err) {
      console.log(err)
      loading.hide()
      weui.alert('网络错误！')
    }
  })

  $('#signUp-btn').click(function() {
    window.localStorage.setItem('mobile', '13619840984')
    $('#dialog').hide()
  })
  //验证码
  function fetchGetCode(mobile) {
    $.ajax({
      url: 'https://a.weixin.hndt.com/boom/openapi/user/send/code',
      type: 'post',
      data: {
        mobile: mobile
      },
      success: function(res) {
        console.log(res)
        weui.toast('验证码发送成功')
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
      countDown()
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
    alert(11)
  })
})()
