const app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    my_info:null
  },

  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var sign = util.sha1(""+timestamp+app.globalData.user_info.user_id)
    wx.request({
      url: app.globalData.URL + "user/getUserInfo.php",
      data: {
        "version": 1,
        "time": timestamp,
        "data": "",
        "sign": sign,
        "token": app.globalData.token
      },
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        try {
          var res_data = util.base64_decode(res.data.data)
          res_data = JSON.parse(res_data)
          that.setData({
            my_info:res_data
          })
        }
        catch (err) {
          console.log(err)
        }
      }
    })
  },

  //跳转至【修改信息】页面
  ToEdit(e) {
    wx.navigateTo({
      url: '../myinfo/edit/edit?detail='+JSON.stringify(this.data.my_info)
    })
  },
  change_data(){
    this.onLoad();
  }
})
