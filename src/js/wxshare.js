window.onload = function() {
  var TITLE = '职能部门人员信息录入'
  var LINK = 'https://a.weixin.hndt.com/h5/hntv2/news/reporter/index.html'
  var IMG_URL = ''
  var DESC = '职能部门人员信息录入'

  //微信配置
  var href = window.location.href
  $.post('https://a.weixin.hndt.com/boom/at/sign', { url: href }, function(data) {
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
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed // 速度，以米/每秒计
        var accuracy = res.accuracy // 位置精度
      }
    })
  })
}
