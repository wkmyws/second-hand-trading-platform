var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userN: '',
    SaveStatus: 'false', //收藏的状态
    SaveNum: 100, //收藏的数量
    ThumbStatus: 'false', //点赞的状态
<<<<<<< HEAD
<<<<<<< HEAD
    ThumbNum: 200, //点赞的数量
    SaveStatus1:'false',
    SaveNum1: 5,
    ThumbStatus1: 'flase',
    ThumbNum1: 12,
    navbar:['首页','热榜','搜索'],
    currentTab:0,
    navbar:['首页','热榜','搜索'],
    currentTab:0,
=======
    ThumbNum: 20 //点赞的数量
>>>>>>> parent of 2d5120f... 0.9.4
=======
    ThumbNum: 20 //点赞的数量
>>>>>>> parent of 2d5120f... 0.9.4
  },

  //收藏和取消收藏，收藏数量
  ChangeSave:function(){
    var sta=this.data.SaveStatus
    var num=this.data.SaveNum
    if(sta){
      this.setData({
        SaveStatus:false,
        SaveNum: num+1
      })
    }
    else{
      this.setData({
        SaveStatus:true,
        SaveNum: num-1
      })
    }
  },

  //点赞和取消点赞，点赞数量
  ChangeThumb:function(){
    var sta=this.data.ThumbStatus
    var num=this.data.ThumbNum
    if(sta){
<<<<<<< HEAD
      this.setData({
        ThumbStatus:false,
        ThumbNum:num+1
      })
    }
    else{
      this.setData({
        ThumbStatus:true,
        ThumbNum:num-1
      })
    }
  },

  plus: function () {
    if (this.data.isPopping) { //缩回动画        
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) { //弹出动画        
      this.takeback();
      this.setData({
        isPopping: true
=======
      this.setData({
        ThumbStatus:false,
        ThumbNum:num+1
      })
    }
    else{
      this.setData({
        ThumbStatus:true,
        ThumbNum:num-1
>>>>>>> parent of 2d5120f... 0.9.4
      })
    }
    console.log("plus")
  },

  plus: function () {
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
    console.log("plus")
  },

  //跳转至【商品发布】页面
  input: function () {
    wx.navigateTo({
      url: '../board/detail/detail',
    })
    console.log("input")
  },

  //跳转至【公告发布】页面
  transpond: function () {
    wx.navigateTo({
      url: '../publish/publish_goods/publish_goods',
    })
    console.log("transpond")
  },
  collect: function () {
    wx.navigateTo({
      url: '../publish/publish_board/publish_board',
    })
    console.log("collect")
  }, //弹出动画 
  popp: function () { //plus顺时针旋转    
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
    animationcollect.translate(0, -80).rotateZ(360).opacity(1).step();
    animationTranspond.translate(-56, -56).rotateZ(360).opacity(1).step();
    animationInput.translate(-80, -0).rotateZ(360).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  }, //收回动画   
  takeback: function () { //plus逆时针旋转  
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

  go:function(){
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

  }
})