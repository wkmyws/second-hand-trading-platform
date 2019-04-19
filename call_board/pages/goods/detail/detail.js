
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLike:true,
    imgUrls: ["http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?"

    ],
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:1000,
    detailImg:[
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?"
    ]

  },
  previewImage:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls: this.data.imgUrls,
    })
  },
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
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