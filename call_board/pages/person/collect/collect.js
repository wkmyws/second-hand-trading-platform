const app = getApp()
var util = require('../../../utils/util.js');
Page({

  data: {
    currentTab:0,
    goods_list:null
  },

  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  get_fav:function(type){
    var that = this
    return new Promise((resolve,reject)=>{
      var data = {
        type:type,
        summary_sub:20
      }
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      data = JSON.stringify(data)
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.request({
        url: app.globalData.URL + "user/getUserFavourite.php",
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
          if (res.data.status == 0) {
            var res_data = JSON.parse(util.base64_decode(res.data.data))
            //console.log(res_data)
            resolve(res_data)
          } else {
            reject(res.data.err_msg)
          }
        }
      })
    })
  },
  onLoad: function (options) {
    var that = this
    that.get_fav(that.data.currentTab).then((data)=>{
      that.setData({
        goods_list:data
      })
    }).catch((err)=>{
      console.log(err)
    })
  },

})