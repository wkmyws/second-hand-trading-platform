var util = require("utils/util.js");
App({
  onLaunch: function(options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    // 登录
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    wx.login({
      success: res => {
        var login_data = {
          "wechat_login_token": res.code
        }
        login_data = JSON.stringify(login_data)
        login_data = util.base64_encode(login_data)
        var sign = util.sha1(login_data + timestamp)
        wx.request({
          url: that.globalData.URL + "user/login.php",
          data: {
            "version": 1,
            "time": timestamp,
            "data": login_data,
            "sign": sign,
            "token": null
          },
          method: 'POST',
          header: {
            "content-type": "application/json"
          },
          success: res => {
            try {
              var res_data = util.base64_decode(res.data.data)
              res_data = JSON.parse(res_data)
              that.globalData.token = res_data.token
              that.globalData.user_info = res_data.user_info
              wx.hideLoading()
              console.log(that.globalData)
            }
            catch(err){
              wx.hideLoading()
              wx.showModal({
                title: '登陆失败',
                content: res.data.err_msg,
              })
              console.log(res.data)
            }
          }
        })
      }
    })
  },
  globalData: {
    user_info: null,
    user_info_wx:null,
    token: "token",
    URL: "http://47.100.40.86/HighSchoolMarket/api/interface/",
  }
})