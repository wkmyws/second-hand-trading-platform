var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    currentTab: 0,
    navScrollLeft: 0, //顶部栏的左边置左
    swiperH: '', //广告牌
    swiperIndex: 0,
    isPopping: false, //是否已经弹出     
    navData: [], //顶部栏的内容
    imgUrls: [
      "http://xcx.nau.edu.cn/images/school5.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school4.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school7.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school6.jpg?" + Math.random() / 9999
    ], //广告牌的图片
    note: [] //瀑布流的样式数据
  },
  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading();

    var data = {
      "summary_sub": 20,
      "count_num": 15,
      "from_id": -1,
      "goods_type": that.data.currentTab + 1,
    }
    that.get_goods_list(data)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },
  //跳转至【商品发布】页面
  publish: function() {
    wx.navigateTo({
      url: '../publish/publish_goods/publish_goods',
    })
    console.log("to_publish")
  },
  get_goods_list: function(data) {
    return new Promise((resolve, reject) => {
      var that = this;
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      data = JSON.stringify(data)
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp)
      wx.request({
        url: app.globalData.URL + "goods/getGoodsList.php",
        data: {
          "version": 1,
          "time": timestamp,
          "data": data,
          "sign": sign,
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          //console.log(res.data)
          var res_data = JSON.parse(util.base64_decode(res.data.data))
          that.setData({
            note: res_data.goods_list
          })
          console.log(that.data.note)
        }
      })
    })
  },
  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#eee'
    })

    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);

    var sign = util.sha1("" + timestamp)

    wx.request({
      url: app.globalData.URL + "goods/getGoodsTypeList.php",
      data: {
        "version": 1,
        "time": timestamp,
        "data": "",
        "sign": sign,
      },
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        var res_data = util.base64_decode(res.data.data)
        res_data = JSON.parse(res_data)
        //console.log(res_data)
        that.setData({
          navData: res_data
        })
        wx.setStorage({
          key: 'goods_classes',
          data: res_data,
        })

        var data = {
          "summary_sub": 20,
          "count_num": 15,
          "from_id": -1,
          "goods_type": 1,
        }
        that.get_goods_list(data)
      }
    })


  },

  switchNav(event) {
    var that = this
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    that.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
    }
    var data = {
      "summary_sub": 20,
      "count_num": 15,
      "from_id": -1,
      "goods_type": cur + 1,
    }
    that.get_goods_list(data)
    console.log(cur)
  }, //顶部栏
  swiperChange: function(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  swiperAd: function() {
    wx.navigateTo({
      url: '../goods/advertise/advertise',
    })
  },

  onReady: function() { // 生命周期函数--监听页面初次渲染完成  
  },
  onShow: function() { // 生命周期函数--监听页面显示  
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏   
  },


  onReachBottom: function() {
    // 页面上拉触底事件的处理函数   
  },


})