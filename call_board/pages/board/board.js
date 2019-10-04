var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userN: '',
    SaveNum: 10, //收藏的数量
    ThumbNum: 20, //点赞的数量
    navbar:['首页','热榜','搜索'],
    currentTab:0,
    scrollTop: 0,
    showView: true,
    animationData: {} //动画效果
  },
navbarTap:function(e){
  this.setData({
    currentTab: e.currentTarget.dataset.idx
  })
},
  //收藏和取消收藏，收藏数量
  ChangeSave: function() {
    var sta = this.data.SaveStatus
    var num = this.data.SaveNum
    if (sta) {
      this.setData({
        SaveStatus: false,
        SaveNum: num + 1
      })
    } else {
      this.setData({
        SaveStatus: true,
        SaveNum: num - 1
      })
    }
  },

  //点赞和取消点赞，点赞数量
  ChangeThumb: function() {
    var sta = this.data.ThumbStatus
    var num = this.data.ThumbNum
    if (sta) {
      this.setData({
        ThumbStatus: false,
        ThumbNum: num + 1
      })
    } else {
      this.setData({
        ThumbStatus: true,
        ThumbNum: num - 1
      })
    }
  },

  //跳转至【商品发布】页面

  publish: function() {
    wx.navigateTo({
      url: '../publish/publish_board/publish_board',
    })
    console.log("plus")
  },
  go: function() {
    wx.navigateTo({
      url: '../board/detail/detail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


  /**用户输入 */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    this.animation = animation
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

  //发布按钮，下滑隐藏，上滑显示
  onPageScroll: function (event) {
    let scroll = event.scrollTop; //当前的距离顶部的高度
    let scrollTop = this.data.scrollTop; //记录的距离顶部的高度
    let show = this.data.show;

    //下滑隐藏
    if (scroll - scrollTop > 10 && show) {
      this.animation.translate(80, 0).step({ duration: 400 })
      this.setData({
        animationData: this.animation.export(),
        show: false
      })
    }

    //上滑显示
    if (scroll - scrollTop < -10 && !show) {
      this.animation.translate(0, 0).step({ duration: 400 })
      this.setData({
        animationData: this.animation.export(),
        show: true
      })
    }

    this.setData({
      scrollTop: scroll
    })
  }
})