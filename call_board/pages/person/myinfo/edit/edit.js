// pages/person/myinfo/edit/edit.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['男', '女'],
    index1: 0,
    college: ['润园', '澄园', '泽园', '沁园'],
    index2: 0
  },

  ChangeSex(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  ChangeCollege(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  //将个人信息上传到服务器
  Save(e) {
    wx.request({
      url: '', // 仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
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