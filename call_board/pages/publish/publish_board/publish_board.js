// pages/publish/publish_board.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    images: 0,
    hideAdd: 0
  },

  chooseimage: function() {
    var that = this;
    var img = this.data.images;
    var img_url = this.data.img_url;
    var i = 0;
    wx.chooseImage({
      count: 6 - img, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        for (; i < res.tempFilePaths.length; i++) {
          img_url.push(res.tempFilePaths[i])
        }
        that.setData({
          img_url: img_url,
          images: img + i
        })
        img += i;
        console.log(img);
        if (img >= 6) {
          that.setData({
            hideAdd: 1
          })
        }
      }
    })
  },

  /*图片预览 */
  Preview(e) {
    const index = e.target.dataset.index
    const img_url = this.data.img_url
    wx.previewImage({
      current: img_url[index], //当前预览的图片
      urls: img_url //所有要预览的图片
    })
  },
  //删除图片
  chooseimage: function() {
    var that = this;
    var img = this.data.images;
    var img_url = this.data.img_url;
    var i = 0;
    wx.chooseImage({
      count: 6 - img, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        for (; i < res.tempFilePaths.length; i++) {
          img_url.push(res.tempFilePaths[i])
        }
        that.setData({
          img_url: img_url,
          images: img + i
        })
        img += i;
        console.log(img);
        if (img >= 6) {
          that.setData({
            hideAdd: 1
          })
        }
      }
    })
  },

  /*图片预览 */
  Preview(e) {
    const index = e.target.dataset.index
    const img_url = this.data.img_url
    wx.previewImage({
      current: img_url[index], //当前预览的图片
      urls: img_url //所有要预览的图片
    })
  },
  //删除图片
  Delete: function(e) {
    var that = this;
    var img_url = that.data.img_url;
    var img = that.data.images;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          img_url.splice(index, 1);
          that.setData({
            img_url
          })
          that.setData({
            images: img - 1
          })
          img--;
          if (img < 6) {
            that.setData({
              hideAdd: 0
            })
          }
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },
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