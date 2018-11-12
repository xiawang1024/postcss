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

  //判断是否是微信客户端打开
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
      type: 'POST',
      url: 'https://a.weixin.hndt.com/boom/wx/access/subscribe',
      data: { code: code, state: 'wx5f789dea59c6c2c5', subscribe: false },
      dataType: 'json',
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
  }

  // 填充列表
  $.ajax({
    type: 'GET',
    url: 'https://a.weixin.hndt.com/h5/gdzy/data/index.json',
    dataType: 'json',
    success: function(data) {
      $.ajax({
        type: 'GET',
        url: 'https://a.weixin.hndt.com/boom/openapi/vote/log/show?voteId=3',
        dataType: 'json',
        timeout: 5000,
        success: function(voteList) {
          for (var i = 0; i < data.length; i++) {
            data[i].vote = 0
          }
          var newList = resetList(data, voteList)
          listToHtml(newList)
          loading.hide()
        },
        error: function(err) {
          weui.alert('网络错误！')
          loading.hide()
        }
      })
    },
    error: function(err) {
      console.log(err)
      loading.hide()
      weui.alert('网络错误！')
    }
  })
  function resetList(list, voteList) {
    var len = list.length

    for (key in voteList) {
      for (var i = 0; i < len; i++) {
        var item = list[i]
        // console.log(item.id, key);
        // console.log(item.id == key);
        if (item.id == key) {
          item.vote = voteList[key]
          break
        }
      }
    }
    // console.log(list);
    return list
  }
  function listToHtml(list) {
    var listWrap = $('.g-bd .list-wrap .list-wrap-inner')
    var len = list.length
    var html = ''
    for (var i = 0; i < len; i++) {
      var item = list[i]
      html +=
        '<li class="list" >' +
        '            <div class="avatar-wrap">' +
        '              <a href="">' +
        '                <img' +
        '                  src="' +
        item.icon +
        '"' +
        '                  alt=""' +
        '                  class="avatar"' +
        '                />' +
        '              </a>' +
        '            </div>' +
        '            <div class="text-wrap">' +
        '              <h3 class="name">姓名：' +
        item.title +
        '</h3>' +
        '              <div class="ticket-wrap">' +
        '                <span class="ticket-num">票数：200</span>' +
        '              </div>' +
        '              <button href="" class="link" data-id="' +
        item.id +
        '">' +
        '                <span class="icon"></span> <span class="text">点击投票</span>' +
        '              </button>' +
        '            </div>' +
        '          </li>'

      // html +=
      //   '<li class="list">' +
      //   '                <div class="avatar-wrap">' +
      //   '                    <a href="https://a.weixin.hndt.com/h5/2018dianshang/vote/index.html?id=' +
      //   item.id +
      //   '"><img src="' +
      //   item.icon +
      //   '" alt="" class="avatar"></a>' +
      //   '                </div>' +
      //   '                <div class="text-wrap">' +
      //   '                    <h3 class="name">' +
      //   item.title +
      //   '</h3>' +
      //   '                    <div class="ticket-wrap">' +
      //   '                        <span class="ticket-num">票数:' +
      //   item.vote +
      //   '</span>' +
      //   '                    </div>' +
      //   '                </div>' +
      //   '            </li>'
    }
    listWrap.html(html)
  }

  //tab 切换
  $('.g-tab .item').click(function() {
    var index = $(this).index()
    var top = 0
    var time = 0
    $(this)
      .addClass('z-curt')
      .siblings()
      .removeClass('z-curt')
    if (index == 0) {
      top = $('.g-m .title').offset().top
      time = 500
    } else {
      top = $('.g-bd .title').offset().top
      time = 800
    }

    $('html, body').animate(
      {
        scrollTop: top
      },
      time
    )
  })
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

  //投票
  $(document).on('click', '.g-bd .list-wrap-inner .list .link', function() {
    console.log($(this))
    var userInfo = JSON.parse(weChat.getStorage('WXHNDTOPENID'))
    console.log(userInfo)
    if (!userInfo) {
      weui.alert('请在微信端打开投票！')
      return
    }
    var id = $(this).data('id')
    console.log(id)
    console.log(uuid)
    var appId = 'wx5f789dea59c6c2c5',
      voteId = 3
    var openId = userInfo.openid

    var subLoading = weui.loading('正在提交')
    $.ajax({
      type: 'POST',
      url: 'https://a.weixin.hndt.com/boom/openapi/vote/log/add',
      data: {
        appId: appId,
        openId: openId,
        voteId: voteId,
        id: id,
        uuid: uuid
      },
      dataType: 'json',
      success: function(data) {
        console.log(data)
        subLoading.hide()
        if (data.status == 'ok') {
          weui.alert('投票成功！')
        } else if (data.status == 'warn') {
          weui.alert('投票未开始！')
        } else {
          weui.alert('投票失败！')
        }
      },
      error: function(err) {
        console.log(err)
        weui.alert('网络错误，请重新投票！')
      }
    })
  })
})()
