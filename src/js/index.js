!(function() {
  if (weChat.isWeiXin()) {
    var weChatCode = weChat.getQueryString('code')
    if (weChatCode) {
      getOpenId(weChatCode, function(data) {
        console.log(data)
      })
    }
  }
  function getOpenId(code, cb) {
    $.ajax({
      type: 'GET',
      url: 'https://a.weixin.hndt.com/boom/wx/access/subscribe',
      data: { code: code, state: 'wxbf02a07137a4e2d3', subscribe: false },
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
  }
  function getPostData() {
    var name = $('#name').val()
    var mobile = $('#mobile').val()
    var code = $('#code').val()
    if (!name) {
      weui.topTips('请填写姓名')
      return
    }
    if (!mobile) {
      weui.topTips('请填写手机号')
      return
    }
    if (!code) {
      weui.topTips('请填写验证码')
      return
    }
    return {
      name: name,
      mobile: mobile,
      appId: 'wxbf02a07137a4e2d3',
      code: code
    }
  }
  function fetchGetCode(mobile) {
    $.ajax({
      url: 'https://a.weixin.hndt.com/boom/openapi/user/send/code',
      type: 'post',
      data: {
        mobile: mobile
      },
      success: function(res) {
        console.log(res)
        var status = res.stauts
        if (status) {
          weui.toast('验证码发送成功')
        } else {
          weui.toast('验证码发送失败')
        }
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
    var count = 60
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

  $('#signUp-btn').click(function() {
    var postData = getPostData()
    var userInfo = JSON.parse(window.localStorage.getItem('WXHNDTOPENID'))
    postData.openId = userInfo.openid
    $.ajax({
      type: 'post',
      contentType: 'application/json',
      url: 'https://a.weixin.hndt.com/boom/openapi/user/dept_register',
      data: JSON.stringify(postData),
      success: function(res) {
        console.log(res)
        var status = res.status
        // if (status == 'ok') {
        //   weui.toast('信息提交成功')
        // } else {
        //   weui.alert('您已提交过信息，如需修改请联系管理员')
        // }
        weui.alert(res.msg)
      },
      error: function() {
        weui.alert('系统错误，请联系管理员')
      }
    })
  })
})()
