var util = require("utils/util.js");
App({
  onLaunch: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    // 登录
    wx.login({
      success: res => {
        var login_data = {
          "wechat_login_token":res.code,
          "wechat_user_name": "soapdx"
        }
        login_data = JSON.stringify(login_data)
        login_data = util.base64_encode(login_data) 
        var sign = util.sha1(login_data + timestamp)
        wx.request({
          url: that.globalData.URL+"/user/login.php",
          data:{
            "version":1,
            "time":timestamp,
            "data":login_data,
            "sign":sign,
            "token":null
          },
          method: 'POST',
          header: {
            "content-type": "application/json"
          },
          success: res => {
            var res_data = util.base64_decode(res.data.data)
            res_data = JSON.parse(res_data)
            that.globalData.token = res_data.token
            console.log(res_data)
          }
        })
      }
    })


  },
  globalData: {
    userInfo: null,
    token: "token",
    URL:"http://47.100.40.86/HighSchoolMarket/api/interface",
  }
})