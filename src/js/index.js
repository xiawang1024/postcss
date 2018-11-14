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
  if (window.requestIdleCallback) {
    requestIdleCallback(function() {
      fingerHash()
    })
  } else {
    setTimeout(function() {
      fingerHash()
    }, 500)
  }
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
      var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'))
      if (!userInfo) {
        weui.alert('请打开微信投票！')
        return
      }
      var voteLoading = weui.loading('努力提交中...')

      var appId = 'wx5f789dea59c6c2c5',
        voteId = 3
      var openId = userInfo.openid

      $.ajax({
        type: 'POST',
        url: 'https://a.weixin.hndt.com/boom/openapi/vote/log/add',
        dataType: 'json',
        timeout: 5000,
        data: {
          appId: appId,
          openId: openId,
          voteId: voteId,
          id: id,
          uuid: uuid
        },
        success: function(data) {
          voteLoading.hide()
          if (data.status == 'ok') {
            weui.alert('投票成功！')
            refreshVote()
          } else if (data.status == 'warn') {
            weui.alert('投票未开始！')
          } else {
            weui.alert('投票失败！')
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
  function refreshVote() {
    //投票信息
    $.ajax({
      type: 'post',
      url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteshow',
      data: {
        id: weChat.getQueryString('id')
      },
      dataType: 'json',
      success: function(data) {
        $('.g-bd .ticket-num').html('票数：' + data.data + '')
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

  //更新投票数
  // $.ajax({
  //   type: 'post',
  //   url: 'https://a.weixin.hndt.com/boom/api/battle/entrevoteshow',
  //   data: {
  //     id: weChat.getQueryString('id')
  //   },
  //   dataType: 'json',
  //   timeout: 10000,
  //   success: function(data) {
  //     loading.hide()
  //     $('.g-bd .ticket-num').html('票数：' + data.data + '')
  //   },
  //   error: function(err) {
  //     console.log(err)
  //     loading.hide()
  //     weui.alert('网络错误！')
  //   }
  // })
})()
