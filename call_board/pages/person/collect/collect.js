var util = require('../../../utils/util.js');
const app = getApp()
Page({

  data: {
    currentTab: 0,
    boards:['test'],//存放公告的数组
    goods:[],//存放商品的数组
  },
/*
  goods[i]={
    collection_id:collection_id,
    goods_title:goods_title,
    goods_summary:goods_summary,
    goods_price:goods_price,
    goods_collection_amount:goods_collection_amount,
    goods_browser_amount:goods_browser_amount,
    goods_head_image:goods_head_image,
  }
 */
  onLoad: function (options) {
    //拉取 个人收藏-商品
    new Promise((resolve,reject)=>{
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      var data = JSON.stringify({ type: 0, summary_sub:10 })
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
      /*测试数据，记得删除下面的setData()
      this.setData({
        goods:[
          {
            collection_id: 3,
            goods_title: "apt",
            goods_summary: "aa",
            goods_price: 988,
            goods_collection_amount: 10,
            goods_browser_amount: 1000,
            goods_head_image: '',
          },
          {
            collection_id: 2,
            goods_title: "user",
            goods_summary: "sudo su root",
            goods_price: 23,
            goods_collection_amount: 3,
            goods_browser_amount: 34,
            goods_head_image: '',
          }
        ]
      })*/
      //---------
      //获取卖家信息
      this.data.goods.forEach((item, index) => {
        new Promise((resolve, reject) => {
          //init
          var timestamp = Date.parse(new Date());
          timestamp = String(timestamp / 1000);
          var data = JSON.stringify({ goods_id: item.collection_id, just_get_info: true })
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
              resolve(JSON.parse(util.base64_decode(res.data.data)))
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
          console.log(this.data.goods)
        })//end promise
      })


 
    },
    err=>{
      console.error('不能取得 我的收藏-商品 数据')
    })
  },

  onReady: function () {

  },

  onShow: function () {

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
  good: function () {
    wx.navigateTo({
      url: '../collect/collect-good/collect-good'
    })
  }


})