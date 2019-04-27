const app = getApp();
var util = require("../../../../utils/util.js");
Page({
  data: {
    my_info:null,
    sex: ['未知','男', '女'],
  },
  change_name(e){
    var that = this
    var my_info = that.data.my_info
    my_info.user_name = e.detail.value
    that.setData({
      my_info
    })
  },
  change_sex(e) {
    var that = this
    var my_info = that.data.my_info
    my_info.user_sex = that.data.sex[e.detail.value]
    that.setData({
      my_info
    })
  },
  change_wx(e) {
    var that = this
    var my_info = that.data.my_info
    my_info.user_wechat = e.detail.value
    that.setData({
      my_info
    })
  },
  change_qq(e) {
    var that = this
    var my_info = that.data.my_info
    my_info.user_qq = e.detail.value
    that.setData({
      my_info
    })
  },
  change_phone(e) {
    var that = this
    var my_info = that.data.my_info
    my_info.user_phone = e.detail.value
    that.setData({
      my_info
    })
  },
  get_user_info(e){
    var that = this
    var my_info = that.data.my_info
    my_info.user_name = e.detail.userInfo.nickName
    my_info.user_sex = that.data.sex[e.detail.userInfo.gender]
    that.setData({
      my_info
    })
    app.globalData.user_info_wx = e.detail.userInfo
    console.log(app.globalData.user_info_wx)
  },

  //将个人信息上传到服务器
  save() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var data = that.data.my_info
    data = JSON.stringify(data)
    data = util.base64_encode(data)
    var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
    wx.request({
      url: app.globalData.URL + "user/setUserInfo.php",
      data: {
        "version": 1,
        "time": timestamp,
        "data": data,
        "sign": sign,
        "token": app.globalData.token
      },
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        try {
          if(res.data.status==0){
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 500
            })
            setTimeout(function () {
              that.change_parent_data();
              wx.navigateBack();
            }, 500) 
            
          }
          else{
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 500
            })
          }
        }
        catch (err) {
          console.log(res.data)
        }
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      my_info:JSON.parse(options.detail)
    })
    var my_info = that.data.my_info
    if(my_info.user_school_name==null){
      my_info.user_school_name='请选择学校'
      that.setData({
        my_info
      })
    }
  },

  change_parent_data: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.change_data();//触发父页面中的方法
    }
  }

})