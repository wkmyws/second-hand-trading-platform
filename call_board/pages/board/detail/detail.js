// pages/board/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [
      "http://xcx.nau.edu.cn/images/plus.png?"
    ],
    popup: true
  },

  showPopup() {
    this.hidePopup(false);
  },

  /*图片预览 */
  Preview(e) {
    var idx = e.target.dataset.idx
    var img_url = this.data.img_url
    wx.previewImage({
      current: img_url[idx], //当前预览的图片
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

  }
})