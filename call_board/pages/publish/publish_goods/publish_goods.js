var util = require('../../../utils/util.js');
var uploadImg=require('../../../uploadImg.js')
const app = getApp()
Page({
  /* 页面的初始数据 */
  data: {
    classes: [],
    classes_index: 0,
    img_url: [],
    img_info: [],
    img_id:[],
    imgArr:[],//key 0.. id:..  src:..
    images: 0,
    hideAdd: 0, //0为显示，1为隐藏
    goods_title: null,
    goods_price: null,
    goods_content: null,
  },
  image_upload: function(img) {
  },
  submit: function(e) {
    //校验数据有效性
    wx.showToast({
      title: '校验数据中...',
      icon:'loading'
    })
    if (!this.data.goods_title || /\s/.test(this.data.goods_title)){//名称规则
      wx.showToast({
        title: '商品名称不能为空或含有空白符',
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
    if(this.data.imgArr.length==0){
      wx.showToast({
        title: '至少上传一张图片',
        icon: 'none',
      })
      return;
    }
    //submit
    console.log('submit')
    var that = this
    var data = {
      goods_title: that.data.goods_title,
      goods_content: that.data.goods_content,
      goods_price: that.data.goods_price-0,
      goods_type: parseInt(that.data.classes_index) + 1,
      goods_picture_arr: that.data.imgArr.map((v) => { return v.id - 0 }),
    }
    console.log(data)
    app.qkpost('goods/submitNewGoods.php',data).then(res_data=>{
      if (res_data.submit_success){
        //发布成功
        console.log('发布成功')
      }else{
        console.log('发布失败')
        console.log(res_data.err_state)
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
    wx.chooseImage({
      count: 5 - this.data.imgArr.length, // 默认5
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        var promise_list = []
        for (var i in res.tempFilePaths) {
          promise_list.push(uploadImg.registerCOSImage(res.tempFilePaths[i]))
        }
        Promise.all(promise_list).then(function(res_data) {
          for (i = 0; i < res_data.length; i++) {
            that.data.imgArr.push({"id":res_data[i],"url":res.tempFilePaths[i]})
          }
          console.log('promise all')
          that.setData({
            imgArr:that.data.imgArr
          })
          if (that.data.imgArr.length >= 5) {
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
    wx.previewImage({
      current: this.data.imgArr[index].url, //当前预览的图片
      urls: this.data.imgArr.map((v)=>{return v.url}) //所有要预览的图片
    })
  },
  //删除图片
  Delete: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          that.data.imgArr.splice(index, 1);
          that.setData({
            imgArr:that.data.imgArr
          })
          if (that.data.imgArr < 5) {
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

  },
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }

})