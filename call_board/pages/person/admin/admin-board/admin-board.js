
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