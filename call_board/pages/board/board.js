

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   userN: '',

  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**用户输入 */
  
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
  userNameInput: function (e) {
    this.setData({
      userN: e.detail.value
    })
  },

  /*公告栏的详细界面* */
  go: function (e) {
    wx.navigateTo({
      url: '../person/help/help' ,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})