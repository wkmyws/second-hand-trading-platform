
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [
      "http://xcx.nau.edu.cn/images/adv4.jpg?",
      "http://xcx.nau.edu.cn/images/plus.png?",
      "http://xcx.nau.edu.cn/images/adv1.jpg?",
      "http://xcx.nau.edu.cn/images/adv2.jpg?",
      "http://xcx.nau.edu.cn/images/school1.jpg?",
      "http://xcx.nau.edu.cn/images/plus.png?"
    ],
    SaveStatus: 'false', //收藏的状态
    SaveNum: 10, //收藏的数量
    ThumbStatus: 'false', //点赞的状态
    ThumbNum: 20,//点赞的数量


  },

  /*图片预览 */
  Preview(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var img_url = this.data.img_url;
    wx.previewImage({
      current: img_url[index], //当前预览的图片
      urls: img_url //所有要预览的图片
    })
  },


  ChangeSave: function () {
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
  ChangeThumb: function () {
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

  }
})