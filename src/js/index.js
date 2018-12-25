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
  }
  function getPostData() {
    var department = $('#depart').html()
    var name = $('#name').val()
    var mobile = $('#mobile').val()
    var code = $('#code').val()
    if (department == '请选择部门') {
      weui.topTips('请选择部门')
      return
    }
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
      department: department,
      name: name,
      mobile: mobile,
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

  $('#signUp-btn').click(function() {
    var postData = getPostData()
    var userInfo = JSON.parse(window.localStorage.getItem('WXHNDTOPENID'))
    postData.password = 'password'
    postData.appId = userInfo.appid
    postData.openId = userInfo.openid
    $.ajax({
      type: 'post',
      contentType: 'application/json',
      url: 'https://a.weixin.hndt.com/boom/openapi/user/register',
      data: JSON.stringify(postData),
      success: function(res) {
        console.log(res)
        var status = res.status
        if (status == 'ok') {
          weui.toast('信息提交成功')
        } else {
          weui.alert('您已提交过信息，如需修改请联系管理员')
        }
      },
      error: function() {
        weui.alert('系统错误，请联系管理员')
      }
    })
  })

  $('.depart').click(function() {
    weui.picker(
      [
        {
          label: '部门1',
          value: 0
        },
        {
          label: '部门2',
          value: 1
        },
        {
          label: '部门3',
          value: 3
        },
        {
          label: '部门4',
          value: 4
        }
      ],
      {
        container: 'body',
        defaultValue: [1],
        onChange: function(result) {
          console.log(result)
        },
        onConfirm: function(result) {
          console.log(result)
          var label = result[0].label
          $('.depart').html(label)
        },
        id: 'singleLinePicker'
      }
    )
  })
})()
