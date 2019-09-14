const app = getApp()
var util = require('../../../../utils/util.js');
Page({
  data: {
    hidden: true,
    showModalStatus: false,
    animationData: {},
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goods_detail: null,
    seller_data: null,
    ThumbStatus: 'false', //点赞的状态
    ThumbNum: 0, //点赞的数量
    SaveStatus: 'false', //收藏的状态
    ViewNum: 0,//点赞的数量

  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.goods_detail.goods_image_list,
    })
  },

  
  get_detail: function (options) {
    return new Promise((resolve, reject) => {
      var that = this
      var data = {
        goods_id: parseInt(options.id)
      }
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      data = JSON.stringify(data)
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)

      wx.request({
        url: app.globalData.URL + "goods/getGoodsDetail.php",
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
            that.setData({
              goods_detail: res_data
            })
            var data = {
              goods_id: res_data.goods_id,
              seller_id: res_data.user_id
            }
            var timestamp = Date.parse(new Date());
            timestamp = String(timestamp / 1000);
            data = JSON.stringify(data)
            data = util.base64_encode(data)

            var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
            wx.request({
              url: app.globalData.URL + "goods/getSellerInfo.php",
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
                  var seller_data = JSON.parse(util.base64_decode(res.data.data))
                  console.log(seller_data)
                  that.setData({
                    seller_data: seller_data,
                  })

                  var data = {
                    goods_id: that.data.goods_detail.goods_id,
                  }
                    
                } else {
                  wx.showModal({
                    title: res.data.err_msg,
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.navigateBack({})
                      }
                    }
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: res.data.err_msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({})
                }
              }
            })
          }
        }
      })
    })
  },
  passItemUpLoad: function (type, info_id, check_pass, check_conclusion) {
    return new Promise((resolve, reject) => {
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
  onLoad: function (options) {
    this.get_detail(options)
  },
  withdrawInfo:function(){//撤回发布商品
    const type = 0
    const info_id = this.data.goods_detail.goods_id
    app.qkpost('manage/withdrawInfo.php', { "type": type, "info_id": info_id}).then(res=>{
      wx.showToast({
        title: '撤回成功',
        icon: 'success',
      })
      setTimeout(wx.navigateBack, 500)
    })
  },
  passItem:function(e){
    const type=0
    const info_id=this.data.goods_detail.goods_id
    const check_pass = e.target.dataset.pass == "true"
    wx.showToast({
      title: '提交中',
      icon:'loading'
    })
    this.passItemUpLoad(type,info_id,check_pass).then(()=>{
      wx.showToast({
        title: '提交成功',
        icon:'success',
      })
    }).catch(()=>{
      wx.showToast({
        title: '提交失败',
        icon:'none',
      })
    })
    setTimeout(wx.navigateBack,500)
  },


})