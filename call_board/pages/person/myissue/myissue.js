Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    SaveStatus: 'false', //收藏的状态
    SaveNum: 10, //收藏的数量
    ThumbStatus: 'false', //点赞的状态
    ThumbNum: 20,//点赞的数量
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

  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  board: function () {
    wx.navigateTo({
      url: '../myissue/myissue-board/myissue-board'
    })
  },
  good: function () {
    wx.navigateTo({
      url: '../myissue/myissue-good/myissue-good'
    })
  }


})