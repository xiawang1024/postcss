window.onload = function() {
  var TITLE = '2018“感动中原”十大年度人物'
  var LINK =
    'https://a.weixin.hndt.com/h5/gdzy/detail/index.html?id=' +
    weChat.getQueryString('id') //分享链接
  var IMG_URL = 'https://a.weixin.hndt.com/h5/gdzy/icon-share.png'
  var DESC = '2018“感动中原”十大年度人物网络投票活动'
  var url =
    'https://a.weixin.hndt.com/h5/2018dianshang/data/' +
    weChat.getQueryString('id') +
    '.json'
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    timeout: 5000,
    success: function(data) {
      TITLE = TITLE + '——' + data.title
    },
    error: function(err) {
      console.log(err)
      weui.alert('网络错误')
    }
  })
  //微信配置
  var href = window.location.href
  $.post('https://a.weixin.hndt.com/boom/at/sign', { url: href }, function(
    data
  ) {
    wx.config({
      debug: false,
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'chooseImage',
        'previewImage',
        'startRecord',
        'playVoice',
        'stopRecord',
        'downloadVoice',
        'uploadVoice',
        'stopVoice',
        'getLocation',
        'openLocation'
      ]
    })
  })

  wx.ready(function() {
    wx.onMenuShareTimeline({
      title: TITLE,
      link: LINK,
      imgUrl: IMG_URL,
      success: function() {},
      cancel: function() {}
    })
    wx.onMenuShareAppMessage({
      title: TITLE,
      desc: DESC,
      link: LINK,
      imgUrl: IMG_URL,
      type: '',
      dataUrl: '',
      success: function() {},
      cancel: function() {}
    })
  })
}
