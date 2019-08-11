const util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    boards: ['test'],//存放公告的数组
    goods: [],//存放商品的数组 
    end_goods_id:null,//已加载的最后一组物品数据，为null则没有了
  },

  onReady: function (options) {
    this.getGoodsItem(-1);
  },

  getGoodsItem:function(last_id){
    //获取用户提交物品
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var data = JSON.stringify({
      summary_sub: 10,
      count: 10,
      from_id: last_id,
      type: 0
    })
    data = util.base64_encode(data)
    var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
    wx.request({
      url: app.globalData.URL + 'user/getUserSubmit.php',
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
        if (res.data.status == 1) {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 4000
          })
          return;
        }
        res = JSON.parse(util.base64_decode(res.data.data))
        this.setData({
          goods: this.data.goods.concat(res.goods_list),
          end_goods_id: res.end_goods_id
        })
      }
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
      url: '../myissue/myissue-board/myissue-board'
    })
  },
  good: function (e) {
    wx.navigateTo({
      url: '../myissue/myissue-good/myissue-good?id='+e.currentTarget.dataset.id
    })
  }


})