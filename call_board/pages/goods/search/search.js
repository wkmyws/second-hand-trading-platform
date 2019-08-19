Page({
  /**
   * 页面的初始数据**/
  data: {
  // 组件所需的参数
  search_from: 1,//	从第几个搜索结果继续搜索（>=0，从头开始为1）
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  startSearch: function (e) {//搜索
    console.log('start search')
    const searchContent = e.detail.value
    if (searchContent == '' || searchContent.replace(/\s+/g, '').length == 0) {
      wx.showToast({
        title: '未输入任何内容!',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    //post
    const ptdata = {
      search_str: searchContent,
      search_amount: 10,
      search_from: this.data.search_from,
      summary_sub: 15,
    }
    app.qkpost('goods/searchGoods.php', ptdata, "noToken").then((data) => {
      console.log(data)
      wx.showToast({
        title: '搜索到 ' + data.search_amount + ' 个结果',
      })
    }).catch(() => {
      console.log('搜索失败')
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
  onUnload: function() {

  },

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
  backTo: function() {
   wx.navigateBack({
     delta:1
   })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})