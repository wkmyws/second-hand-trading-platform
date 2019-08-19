const app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    myinfo:null
  },

  onShow: function (options) {
    this.setData({
      myinfo: app.globalData.user_info
    })
  },

  //跳转至【修改信息】页面
  ToEdit(e) {
    wx.navigateTo({
      url: '../myinfo/edit/edit?detail='+JSON.stringify(this.data.my_info)
    })
  },
  change_data(){
    this.onShow();
  },
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})
