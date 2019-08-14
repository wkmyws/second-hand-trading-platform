var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    goods:[],
    boards:['test'],
  },

  onShow: function (options) {
    //获取待审核商品
    new Promise((resolve,reject)=>{
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      var data = JSON.stringify({ amount: 10, summary_sub: 10, type: 0 })
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      //request
      wx.request({
        url: app.globalData.URL + 'manage/getWaitCheckList.php',
        data: {
          "version": 1,
          "time": timestamp,
          "data": data,
          "sign": sign,
          "token": app.globalData.token,
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          if (res.data.status == 1) return reject();
          res = JSON.parse(util.base64_decode(res.data.data))
          this.setData({
            goods: res.goods_list
          })
          return resolve();
        }
      })//end request
    }).then(()=>{
      console.log('emm')
      console.log(this.data.goods)
    }).catch(()=>{
      wx.showToast({
        title: '所在用户组权限不够',
        icon: 'none',
        duration: 4000
      })
      wx.navigateBack()
    })

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

  board: function () {
    wx.navigateTo({
      url: '../admin/admin-board/admin-board'
    })
  },
  good: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../admin/admin-good/admin-good?id=' + e.currentTarget.dataset.id
    })
  }


})