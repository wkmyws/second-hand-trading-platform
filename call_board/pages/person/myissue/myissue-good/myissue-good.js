
Page({
  data: {
    hidden: true,
    is_fav: true,
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
    ThumbNum: 20, //点赞的数量
    SaveStatus: 'false', //收藏的状态
    ViewNum: 20,//点赞的数量
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
                    set_favourite: that.data.is_fav
                  }
                  that.fav(data).then((value) => {
                    //操作正常,前后重设为false
                    that.setData({
                      is_fav: false
                    })
                    var data = {
                      goods_id: that.data.goods_detail.goods_id,
                      set_favourite: that.data.is_fav
                    }
                    that.fav(data).then(
                      that.setData({
                        hidden: false
                      })
                    )
                  })
                    .catch((value) => {
                      //重复收藏，前后台都为true不变
                      that.setData({
                        hidden: false
                      })
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
  onLoad: function (options) {
    var that = this
    that.get_detail(options)
  },


})