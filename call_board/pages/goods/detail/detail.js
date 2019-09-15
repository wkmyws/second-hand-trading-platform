const app = getApp()
var util = require('../../../utils/util.js');
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
    user_id:null,
    user_name:null,
    user_avatar_url:null,
    canBuy:true,
  },

  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.goods_detail.goods_image_list,
    })
  },

  gotoAttest:function(){//跳转至发布页面
    wx.redirectTo({
      url: '/pages/person/attest/attest'
    })
  },

  buy: function() {
    this.showModal();
  },

  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  callPhone: function(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  },
  copyIt: function(event) {
    wx.setClipboardData({
      data: event.target.id
    })
    wx.showToast({
      title: '已复制到粘贴版',
      icon: 'none',
      duration: 1000
    });
  },

  set_fav: function() {
    wx.showToast({
      title: (this.data.is_fav?'取消':'')+'收藏中...',
      icon:'loading',
      mask:false
    })
    var data = {
      goods_id: this.data.goods_detail.goods_id,
      set_favourite: !this.data.is_fav
    }
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    data = JSON.stringify(data)
    data = util.base64_encode(data)
    var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
    //request
    wx.request({
      url: app.globalData.URL + "goods/setGoodsFavourite.php",
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
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '收藏操作失败！',
            duration: 2000,
            mask: true
          })
        } else {
          this.setData({
            is_fav:!this.data.is_fav
          })
          wx.showToast({
            title: (this.data.is_fav?'':'取消')+'收藏成功',
            duration: 2000,
            mask: false
          })
          this.setData({
            ThumbNum: this.data.ThumbNum + (this.data.is_fav?1:-1)
          })
        }
      }
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

  get_detail: function(options) {//获取物品信息
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
          console.log(res)//---------------------------
          if (res.data.status == 0) {
            var res_data = JSON.parse(util.base64_decode(res.data.data))
            if (res_data.goods_state-0==3){//商品已经出售
              wx.showModal({
                title: "此商品已出售😥",
                conten: "",
                showCancel: false,
              })
            }else if(res_data.goods_state-0!=2){//其他不可见原因，用于管理员权限组，普通用户status==1
              wx.showModal({
                title: "此商品已被隐藏😥",
                conten: "",
                showCancel: false,
              })
            }
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
                    canBuy:true
                  })
                } else {
                  this.setData({canBuy:false})
                }
              }
            })
            
          } else {
            wx.showModal({
              title: "此商品已被隐藏😥",
              conten:"",
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

  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: this.data.goods_detail.goods_title,
      path: 'pages/goods/detail/detail?id=' + this.data.goods_detail.goods_id,  // 路径，传递参数到指定页面。
      imageUrl: this.data.imgUrls[0], // 分享的封面图
      
    }

  },
  onLoad: function(options) {
    var that = this
    that.get_detail(options)
  },
  seeOthers:function(){
    wx.navigateTo({
      url: '../../otherinfo/otherinfo?other_user_id='+this.data.user_id
    })
  }
})