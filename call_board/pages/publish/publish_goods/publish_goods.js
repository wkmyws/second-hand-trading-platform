var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /* 页面的初始数据 */
  data: {
    classes: [],
    classes_index: 0,
    img_url: [],
    img_info: [],
    images: 0,
    hideAdd: 0, //0为显示，1为隐藏
    goods_title: null,
    goods_price: null,
    goods_content: null,
  },
  image_upload: function(img) {
    var that = this
    return new Promise((resolve, reject) => {
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      console.log(img.url)
      wx.uploadFile({
        url: app.globalData.URL + "upload/uploadImage.php",
        filePath: img.url,
        name: 'file',
        formData: {
          version: 1,
          token: app.globalData.token,
          picture_id: img.id
        },
        success: function(res) {
          var res_data = JSON.parse(res.data)

          if (res_data.status == 0) {
            res_data = util.base64_decode(res_data.data)

            console.log(JSON.parse(res_data).picture_url)
            resolve(img.id)
          } else {
            reject(res_data.err_msg)
          }

        },
      })
    })
  },
  submit: function(e) {
    //校验数据有效性
    wx.showToast({
      title: '校验数据中...',
      icon:'loading'
    })
    if (!this.data.goods_title || /\s/.test(this.data.goods_title)){//名称规则
      wx.showToast({
        title: '商品名称为空或含有空白符',
        icon: 'none',
        duration:4000
      })
      return;
    }
    if(/^\d+(\.\d{0,2})?$/.test(this.data.goods_price+'')==false){//价格规则
      wx.showToast({
        title: '价格输入错误',
        icon:'none',
      })
      return;
    }
    if (!this.data.goods_content){
      wx.showToast({
        title: '描述内容为空',
        icon: 'none',
      })
      return;
    }
    //submit
    console.log('submit')
    var that = this
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    wx.showLoading({
      title: '上传图片中',
    })
    //console.log(that.data.img_info)
    //console.log(that.data.goods_title)
    //console.log(that.data.goods_price)
    //console.log(that.data.goods_content)

    var promise_list = []
    for (let i in that.data.img_info) {
      if (that.data.img_info[i].exist == false) {
        promise_list.push(that.image_upload(that.data.img_info[i]))
      }
    }
    Promise.all(promise_list).then((data) => {
      for (let i in data) {
        var img_info = that.data.img_info
        for (let id in img_info) {
          if (data[i] == img_info[id].id) {
            img_info[id].exist = true
          }
        }
        that.setData({
          img_info: img_info
        })
      }

    }).then(() => {
      wx.hideLoading()
      wx.showLoading({
        title: '发布商品中',
      })
      var goods_picture_arr = []
      for (let i in that.data.img_info) {
        if (that.data.img_info[i].exist == true) {
          goods_picture_arr.push(that.data.img_info[i].id)
        }
      }
      if (goods_picture_arr.length == 0) {
        wx.showToast({
          title: '至少上传一张图片',
          icon:'none'
        })
        wx.hideLoading()
      } else {
        var timestamp = Date.parse(new Date());
        timestamp = String(timestamp / 1000);
        var data = {
          'goods_title': that.data.goods_title,
          'goods_content': that.data.goods_content,
          'goods_price': Number(that.returnFloat(that.data.goods_price)),
          'goods_type': parseInt(that.data.classes_index) + 1,
          'goods_picture_arr': goods_picture_arr
        }
        data = JSON.stringify(data)
        console.log(data)
        data = util.base64_encode(data)
        var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)

        wx.request({
          url: app.globalData.URL + "goods/submitNewGoods.php",
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
            wx.hideLoading()
            console.log(res.data)
            if (res.data.status == 0) {
              var res_data = JSON.parse(util.base64_decode(res.data.data))
              console.log(res_data)
              if (res_data.submit_success) {
                wx.showModal({
                  title: '发布成功',
                  content: '商品将在被审核后显示，你可以在个人-我的发布页面查看审核状态',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        
                      })
                    }
                  }
                })

              } else {
                if (res_data.err_state == 0) {
                  wx.showModal({
                    title: '发布失败',
                    content: '用户权限不足',
                    showCancel: false
                  })
                } else
                if (res_data.err_state == 1) {
                  wx.showModal({
                    title: '发布失败',
                    content: '标题中存在敏感词',
                    showCancel: false
                  })
                } else
                if (res_data.err_state == 2) {
                  wx.showModal({
                    title: '发布失败',
                    content: '内容中存在敏感词',
                    showCancel: false
                  })
                }
              }
            }else{
              //console.log(res.data)
              wx.showModal({
                title: '发布失败',
                content: res.data.err_msg,
                showCancel: false
              })
            }
          }
        })
      }
    })
  },

  get_type: function(e) {
    this.setData({
      classes_index: e.detail.value
    })
  },
  get_title: function(e) {
    this.setData({
      goods_title: e.detail.value
    })
  },
  get_price: function(e) {
    this.setData({
      goods_price: e.detail.value
    })
  },
  get_content: function(e) {
    this.setData({
      goods_content: e.detail.value
    })

  },


  chooseimage: function() {
    var that = this;
    var img = that.data.images;
    var img_url = that.data.img_url;
    var img_info = that.data.img_info;
    wx.chooseImage({
      count: 5 - img, // 默认5
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        function get_data() {
          return new Promise((resolve, reject) => {
            var image_url = res.tempFilePaths[i]
            wx.getFileInfo({
              filePath: image_url,
              digestAlgorithm: 'sha1',
              success(res) {
                var image_sha1 = res.digest
                var timestamp = Date.parse(new Date());
                timestamp = String(timestamp / 1000);
                var data = {
                  "picture_sha1": image_sha1
                }
                data = JSON.stringify(data)
                data = util.base64_encode(data)
                var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
                wx.request({
                  url: app.globalData.URL + "upload/registerImage.php",
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
                    var res_data = util.base64_decode(res.data.data)
                    res_data = JSON.parse(res_data)
                    data = {
                      url: image_url,
                      id: res_data.picture_id,
                      sha1: image_sha1,
                      exist: res_data.picture_exist
                    }
                    resolve(data)
                  },
                })
              },
            })
          })
        }
        var promise_list = []
        for (var i in res.tempFilePaths) {
          promise_list.push(get_data())
        }
        Promise.all(promise_list).then(function(data) {
          for (i = 0; i < data.length; i++) {
            img_url.push(data[i].url)
            img_info.push(data[i])
          }

          that.setData({
            img_url: img_url,
            img_info: img_info,
            images: img + i
          })
          img += i;
          if (img >= 5) {
            that.setData({
              hideAdd: 1
            })
          }

        })
        //console.log(img_info)
      }
    })
  },

  /*图片预览 */
  Preview(e) {
    const index = e.target.dataset.index
    const img_url = this.data.img_url
    wx.previewImage({
      current: img_url[index], //当前预览的图片
      urls: img_url //所有要预览的图片
    })
  },
  //删除图片
  Delete: function(e) {
    var that = this;
    var img_url = that.data.img_url;
    var img_info = that.data.img_info;
    var img = that.data.images;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          img_url.splice(index, 1);
          img_info.splice(index, 1);
          that.setData({
            img_url
          })
          that.setData({
            images: img - 1
          })
          img--;
          if (img < 5) {
            that.setData({
              hideAdd: 0
            })
          }
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },
  returnFloat: function(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = value.toString() + ".00";
      return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'goods_classes',
      success: function(res) {
        console.log(res.data)
        var data = []
        for (var i in res.data) {
          data.push(res.data[i].type_name)
        }
        that.setData({
          classes: data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})