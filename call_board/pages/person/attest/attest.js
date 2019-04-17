Page({

  /**
   * 页面的初始数据
   */
  data: {

    index1: 0,
    college: ['南京审计大学'],
popup:true
  },

  ChangeCollege(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  hidePopup(flag = true){
    this.setData({
      "popup": flag
    });
  },
  showPopup(){
    this.hidePopup(false);
  },

  //将个人信息上传到服务器

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onUnload: function() {

  }
})