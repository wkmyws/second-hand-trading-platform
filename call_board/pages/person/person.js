var util = require('../../utils/util.js');
var app = getApp()

Page({

  data: {

    myinfo: null,
    balance: null
  },

  onLoad: function () {

    this.setData({
      extraData: {
        id: '38516', // 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID
        customData: {
          clientInfo: '0.9.2 ',
        }
      }
    })
  },

  onShow: function () {

  },

  tomyinfo: function () {        //跳转至 个人信息
    wx.navigateTo({
      url: '../person/myinfo/myinfo'
    })
  },

  tomyissue: function () {       //跳转至 我的发布
    wx.navigateTo({
      url: '../person/myissue/myissue'
    })
  },

  tocollect: function () {       //跳转至 我的发布
    wx.navigateTo({
      url: '../person/collect/collect'
    })
  },

  showabout: function () {       //跳转至 关于
    wx.navigateTo({
      url: '../person/about/about'
    })
  },

  tohelp: function () {        //跳转至 使用帮助
    wx.navigateTo({
      url: '../person/help/help'
    })
  },

  toadmin: function () {
    wx.navigateTo({
      url: '../person/admin/admin'
    })
  },
  toattest:function () {
    wx.navigateTo({
      url: '../person/attest/attest'
    })
  }


})