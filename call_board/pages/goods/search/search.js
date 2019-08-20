const app=getApp()
Page({
  /**
   * 页面的初始数据**/
  data: {
  // 组件所需的参数
  inputSearchFocus:false,
  search_from: 1,//	从第几个搜索结果继续搜索（>=0，从头开始为1）
  searchContent:'',//搜索内容
  note:[],//商品数组
 },
  /**
   * 生命周期函数--监听页面加载
   */
  startSearch: function (e) {//搜索
    console.log('start search')
    console.log(this.data.searchContent)
    const searchContent = this.data.searchContent
    if (searchContent == '' || searchContent.replace(/\s+/g, '').length == 0) {
      wx.showToast({
        title: '未输入任何内容!',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    this.setData({
      note: [],
      search_from: 1
    })
    //post
    const ptdata = {
      search_str: searchContent,
      search_amount: 7,
      search_from: this.data.search_from,
      summary_sub: 15,
    }
    app.qkpost('goods/searchGoods.php', ptdata, "noToken").then((data) => {
      wx.hideLoading()
      if(data.search_amount==0){
        wx.showToast({
          title: '空空如也😥',
          icon:'none',
          duration:3000
        })
      }else{//搜索到结果则显示
        this.setData({
          search_from:this.data.search_from+data.search_amount,
          note: this.data.note.concat(data.search_result)
        })
      }
    }).catch(() => {
      console.log('搜索失败')
    })
  },
  bindInputSearch:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function(e) {
    this.setData({
      inputSearchFocus:true,
    })
    /*
    *Don't touch this
    console.log('onLoad')
    this.setData({
      searchContent:e.s
    })
    console.log(e.s)
    this.startSearch();
    */
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
    const ptdata = {
      search_str: this.data.searchContent,
      search_amount: 7,
      search_from: this.data.search_from,
      summary_sub: 15,
    }
    app.qkpost('goods/searchGoods.php', ptdata, "noToken").then((data) => {
      wx.hideLoading()
      if (data.search_amount == 0) {
        wx.showToast({
          title: '没有更多了...',
          icon: 'none',
          duration: 3000
        })
      }else{
        this.setData({
          search_from: this.data.search_from + data.search_amount,
          note: this.data.note.concat(data.search_result),
        })
      }
    })
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