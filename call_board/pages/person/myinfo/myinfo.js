Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //跳转至【修改信息】页面
  ToEdit(e){
    wx.navigateTo({
      url: '../myinfo/edit/edit'
    })
  }

})
