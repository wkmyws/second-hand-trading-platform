/*
  passItem()函数用来提交审核结果，参数与 
   https://dev.tencent.com/u/XFY9326/p/HighSchoolMarket/wiki/47
  一致
  eg:

  this.passItem(0,1,true).then(()=>{
    console.log('提交成功')
  }).catch(()=>{
    console.log('提交失败')
  })

 */
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

  onLoad: function (options) {
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
          console.log(res)
          if (res.data.status == 1) return reject();
          res = JSON.parse(util.base64_decode(res.data.data))
          this.setData({
            goods: res
          })
          return resolve();
        }
      })//end request
    }).then(()=>{
      console.log('emm')
    }).catch(()=>{
      wx.showToast({
        title: '所在用户组权限不够',
        icon: 'none',
        duration: 4000
      })

    })

  },

  passItem:function(type,info_id,check_pass,check_conclusion){
    return new Promise((resolve,reject)=>{
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      var data = JSON.stringify({
        type: type,
        info_id: info_id,
        check_pass: check_pass,
        check_conclusion: check_conclusion ? check_conclusion : null,
      })
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      //request
      wx.request({
        url: app.globalData.URL + 'manage/setCheckResult.php',
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
          console.log(res)
          if (res.data.status == 1) return reject();
          else return resolve();
        }
      })
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
  good: function () {
    wx.navigateTo({
      url: '../admin/admin-good/admin-good'
    })
  }


})