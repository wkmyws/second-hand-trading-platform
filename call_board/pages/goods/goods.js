var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    currentTab: 0,
    navScrollLeft: 0,//顶部栏的左边置左
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperH: '',//广告牌
    swiperIndex: 0,
    isPopping: false, //是否已经弹出     
    animPlus: {}, //旋转动画   
    animCollect: {}, //item位移,透明度  
    animTranspond: {}, //item位移,透明度      
    animInput: {}, //item位移,透明度  
    navData: [{
        text: '首页'
      },
      {
        text: '新品'
      },
      {
        text: '书籍'
      },
      {
        text: '化妆品'
      },
      {
        text: '日用品'
      },
      {
        text: '电器'
      },
      {
        text: '电子产品'
      },
      {
        text: '食品'
      },
      {
        text: '文具'
      }
    ],//顶部栏的内容
    imgUrls: [
      "http://xcx.nau.edu.cn/images/school5.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school4.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school7.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school6.jpg?" + Math.random() / 9999
    ],//广告牌的图片
    note: [
      {
        name: '繁星点点',
        heart_num: '1',
        tit:'平凡的世界',
        title: '该书以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象；',
        url: 'http://xcx.nau.edu.cn/images/book.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '繁星点点',
        heart_num: '2',
        tit: '苹果笔记本',
        title:  '苹果笔记本在用工用料和质量上面是非常不错的，而且它有它独特的macos系统；',
        url: 'http://xcx.nau.edu.cn/images/goods.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '繁星点点',
        heart_num: '3',
        tit: '苹果笔记本',
        title:  '苹果笔记本在用工用料和质量上面是非常不错的，而且它有它独特的macos系统；',
        url: 'http://xcx.nau.edu.cn/images/goods.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '繁星点点',
        heart_num: '4',
        tit: '平凡的世界',
        title: '该书以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象；',
        url: 'http://xcx.nau.edu.cn/images/book.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '繁星点点',
        heart_num: '5',
        tit: '平凡的世界',
        title: '该书以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象；',
        url: 'http://xcx.nau.edu.cn/images/book.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '繁星点点',
        heart_num: '6',
        tit: '苹果笔记本',
        title:    '苹果笔记本在用工用料和质量上面是非常不错的，而且它有它独特的macos系统；',
        url: 'http://xcx.nau.edu.cn/images/goods.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '繁星点点好啊哈哈',
        heart_num: '7',
        tit: '苹果笔记本',
        title:     '苹果笔记本在用工用料和质量上面是非常不错的，而且它有它独特的macos系统；',
        url: 'http://xcx.nau.edu.cn/images/goods.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '繁星点点',
        heart_num: '8',
        tit: '平凡的世界',
        title: '该书以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象；',
        url: 'http://xcx.nau.edu.cn/images/book.jpg?',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }
    ]//瀑布流的样式数据
  },
  plus: function() {
    if (this.data.isPopping) { //缩回动画        
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) { //弹出动画        
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },

  //跳转至【商品发布】页面
  input: function() {
    wx.navigateTo({
      url: '../publish/publish_goods',
    })
    console.log("input")
  },

  //跳转至【公告发布】页面
  transpond: function() {
    wx.navigateTo({
      url: '../publish/publish_board',
    })
    console.log("transpond")
  },
  collect: function() {
    wx.navigateTo({
      url: '../goods/detail/detail',
    })
    console.log("collect")
  }, //弹出动画 
  popp: function() { //plus顺时针旋转    
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(360).step();//各个旋转角度
    animationcollect.translate(0, -70).rotateZ(360).opacity(1).step();
    animationTranspond.translate(-60, -60).rotateZ(360).opacity(1).step();
    animationInput.translate(-70, 0).rotateZ(360).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  }, //收回动画   
  takeback: function() { //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();//收回旋转角度
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    }),
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFD161'
    })
  },

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },//顶部栏
  swiperChange: function(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  swiperAd: function () {
    wx.navigateTo({
      url: '../goods/advertise/advertise',
    })
  },//广澳牌
  
switchDetail:function(){
  wx.navigateTo({
    url: '../goods/detail/detail',
  })
},
  onReady: function() { // 生命周期函数--监听页面初次渲染完成  
  },
  onShow: function() { // 生命周期函数--监听页面显示  
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏   
  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载  
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数   
  },
  onShareAppMessage: function() { // 用户点击右上角分享 
    return {
      title: 'title', // 分享标题   
      desc: 'desc', // 分享描述        
      path: 'path', // 分享路径 
      
    }
  }

})
