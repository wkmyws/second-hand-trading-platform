
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isLike:true,
    showModalStatus: false,
    animationData: {},
    imgUrls: ["http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?",
    "http://xcx.nau.edu.cn/images/goods.jpg?"

    ],
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:1000,
    detailImg:[
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?",
      "http://xcx.nau.edu.cn/images/goods.jpg?"
    ],
    tel:[
      "18851962112"
    ],
    wechat:[
"jironggen"
    ],
    qq:[
      "2944414576"
    ]

  },
  previewImage:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls: this.data.imgUrls,
    })
  },
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  clickme: function () {
    this.showModal();
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }
,
  callPhone: function (event) {
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  },
  copyIt: function (event) {
    wx.setClipboardData({
      data: event.target.id
    })
    wx.showToast({
      title: '已复制到粘贴版',
      icon: 'none',
      duration: 1000
    });
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})