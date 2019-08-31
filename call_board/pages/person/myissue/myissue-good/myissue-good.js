const app = getApp()
var util = require('../../../../utils/util.js');
Page({
  data: {
    hidden: false,
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
    ThumbNum: 20, //点赞(收藏)的数量
    ViewNum: 20,//浏览的数量
    user_id: null,
    user_name: null,
    user_avatar_url: null,
    goods_state_name:null,//审核状态
    goods_id:null,
  
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.goods_detail.goods_image_list,
    })
  },

  ChangeThumb: function () {
    var sta = this.data.ThumbStatus
    var num = this.data.ThumbNum
    if (sta) {
      this.setData({
        ThumbStatus: false,
        ThumbNum: num + 1
      })
    } else {
      this.setData({
        ThumbStatus: true,
        ThumbNum: num - 1
      })
    }
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
              goods_detail: res_data,
              ViewNum: res_data.goods_browser_amount,
              ThumbNum: res_data.goods_collection_amount,
              user_id: res_data.user_id,
              user_name: res_data.user_name,
              user_avatar_url: res_data.user_avatar_url,
              is_fav: res_data.is_user_favourite,
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
    console.log('options')
    console.log(options)
    this.get_detail(options)
    this.setData({
      goods_state_name: options.goods_state_name,
      goods_id:options.id
    })
    
  },
  DoneShow:function(){
    const goods_id=this.data.goods_id-0
    wx.showModal({
      title: '标记出售',
      content: '确认该商品已经出售？\r\n(不可再次更改状态)',
      success:sm=>{
        if(sm.confirm){//将商品标为已出售
          app.qkpost('goods/setGoodsSold.php', { goods_id: goods_id}).then(()=>{
            wx.showToast({
              title: '已标为 "已出售" 状态',
              duration:1000,
            })
            setTimeout(wx.navigateBack, 1000)
          }).catch(()=>{
            wx.showToast({
              title: '设置出错',
              icon:'none'
            })
          })
        }
      }
    })
  },
  ToDelete:function(){
    wx.showModal({
      title: '删除',
      content: '确认删除此发布吗？',
      success:sm=>{
        if(sm.confirm){
          let data = { type: 0, info_id: this.data.goods_id - 0 }
          app.qkpost('user/deleteUserSubmit.php', data).then(() => {
            console.log('删除成功')
            wx.showToast({
              title: '删除成功',
              icon:'success',
              duration:500
            })
            setTimeout(wx.navigateBack,500)
          }).catch(() => {
            console.log('删除失败')
            wx.showToast({
              title: '删除失败',
              icon:'none'
            })
          })
        }
      }
    })

  },
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }

})