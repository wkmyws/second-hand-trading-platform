const util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SaveNum: 10, //收藏的数量
    ThumbNum: 20,//点赞的数量
    currentTab: 0,
    boards: ['test'],//存放公告的数组
    goods: [],//存放商品的数组 
    end_goods_id:-1,//已加载的最后一组物品数据，为null则没有了
    user:[],
    scrollViewHgt: wx.getSystemInfoSync().windowHeight+48+"px" //48为修正值，底部距离过大=》数值增加
  },
  onLoad:function(){
  },
  onShow: function (options) {
    console.log('我的发布')
    this.setData({
      goods:[]
    })
    this.getGoodsItem(-1);
  },

  getGoodsItem:function(last_id){
    console.log('from_id:')
    console.log(last_id)
    //获取用户提交物品
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var data = JSON.stringify({
      summary_sub: 100,
      count: 6,
      from_id: last_id,//响应字段 end_goods_id 的值，初始为-1
      type: 0
    })
    data = util.base64_encode(data)
    var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
    this.setData({
      user:{
        user_name: app.globalData.user_info.user_name,
        user_avatar_url: app.globalData.user_info.user_avatar_url	
      }
    })
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
        console.log('return data:')
        console.log(res)
        if(res.goods_list.length==0){
          this.setData({
            end_goods_id:null
          })
          return;
        }
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
      url: '../myissue/myissue-good/myissue-good?id=' + e.currentTarget.dataset.id + '&goods_state_name=' + e.currentTarget.dataset.statename
    })
  },
   toLower: function () {
    // 页面上拉触底事件的处理函数  
    console.log('reachBottom')
    if (this.data.end_goods_id==null) {
      wx.showToast({
        title: '我是有底线的！',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      wx.showToast({
        icon: 'loading',
      })
      this.getGoodsItem(this.data.end_goods_id)
      wx.hideToast()
    }
   },
   toUpper:function(){},
   scroll:function(){},
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})