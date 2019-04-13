// pages/publish/publish_board.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    images: []
  },

  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 6, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) { //图如果满了6张，不显示加图  
          if (res.tempFilePaths.length >= 6) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          } //把每次选择的图push进数组 
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },

  /*图片预览 */
  Preview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    const img_url = this.data.img_url
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: img_url //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})