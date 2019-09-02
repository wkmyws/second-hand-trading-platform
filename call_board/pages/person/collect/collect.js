var util = require('../../../utils/util.js');
const app = getApp()
Page({

  data: {
    SaveNum: 10, //收藏的数量
    ThumbNum: 20,//点赞的数量
    currentTab: 0,
    boards:['test'],//存放公告的数组
    goods:[],//存放商品的数组 
    
  },

  onShow: function (options) {
    wx.showLoading()
    //拉取 个人收藏-商品 
    new Promise((resolve,reject)=>{
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      var data = JSON.stringify({ type: 0, summary_sub:100 })
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.request({
        url: app.globalData.URL + 'user/getUserFavourite.php',
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
          if(res.data.status==1)return reject();
          res=JSON.parse(util.base64_decode(res.data.data))
          this.setData({
            goods:res
          })
          return resolve();
        }
      })
    }).then(()=>{
      //判断收藏是否为0
      if(this.data.goods.length==0){
        wx.hideLoading()
        wx.showModal({
          title: "暂无发布😥",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          }
        })
        return;
      }
      //获取卖家信息
      this.data.goods.forEach((item, index) => {
        new Promise((resolve, reject) => {
          //init
          var timestamp = Date.parse(new Date());
          timestamp = String(timestamp / 1000);
          var data = JSON.stringify({ goods_id: item.goods_id, just_get_info: true })
          data = util.base64_encode(data)
          var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
          //request
          wx.request({
            url: app.globalData.URL + 'goods/getGoodsDetail.php',
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
              if (res.data.status == 1) return reject()
              else return resolve(JSON.parse(util.base64_decode(res.data.data)))
            }
          })
        }).then((res) => {
          const temp = "goods.seller"
          this.data.goods[index].seller_name = res.user_name
          this.data.goods[index].seller_avatar_url = res.user_avatar_url
          this.data.goods[index].goods_publish_time = res.goods_publish_time
          this.setData({
            goods: this.data.goods
          })
          wx.hideLoading()
        }).catch(()=>{
          console.log('获取卖家昵称、头像错误')
        })
        //end promise
      })


 
    },
    err=>{
      console.error('不能取得 我的收藏-商品 数据')
    })
  },

  onReady: function () {

  },


  onHide: function () {

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
      url: '../collect/collect-board/collect-board'
    })
  },
  good: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../collect/collect-good/collect-good?id=' + e.currentTarget.dataset.id
    })
  },
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }


})