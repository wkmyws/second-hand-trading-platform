var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /* 页面的初始数据 */
  data: {
    classes: [],
    classes_index: 0,
    img_url: [],
    images: 0,
    hideAdd: 0, //0为显示，1为隐藏
    goods_title:null,
    goods_price:null,
    goods_content:null,
  },

  get_type: function (e) {
    this.setData({
      classes_index: e.detail.value
    })
  },
  get_title: function (e) {
    this.setData({
      goods_title:e.detail.value
    })
  },
  get_price: function (e) {
    this.setData({
      goods_price:e.detail.value
    })
  },
  get_content: function (e) {
    this.setData({
      goods_content: e.detail.value
    })
  },
  submit:function(e){
    var that = this
    console.log(that.data.img_url)
  },

  chooseimage: function () {
    var that = this;
    var img = that.data.images;
    var img_url = that.data.img_url;
    wx.chooseImage({
      count: 5 - img, // 默认5
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        function get_data(){
          return new Promise((resolve,reject) => {
            var image_url = res.tempFilePaths[i]
            //console.log(image_url)
            var data = {}
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
                      sha1: image_sha1
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
        Promise.all(promise_list).then(function (data) {
          for (i = 0; i < data.length; i++)
            img_url.push(data[i])
        })
        console.log(img_url)

        that.setData({
          img_url: img_url,
          images: img + i
        })
        img += i;
        if (img >= 5) {
          that.setData({
            hideAdd: 1
          })
        }

      }
    })
  },

  /*图片预览 */
  Preview(e) {
    const index = e.target.dataset.index
    const img_url = this.data.img_url

    wx.previewImage({
      current: img_url[index].url, //当前预览的图片
      urls: img_url //所有要预览的图片
    })

  },
  //删除图片
  Delete: function (e) {
    var that = this;
    var img_url = that.data.img_url;
    var img = that.data.images;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          img_url.splice(index, 1);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this
    wx.getStorage({
      key: 'goods_classes',
      success: function(res) {
        console.log(res.data)
        var data = []
        for(var i in res.data){
          data.push(res.data[i].type_name)
        }
        that.setData({
          classes:data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})