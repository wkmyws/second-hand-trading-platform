// pages/otherinfo/otherinfo.js
//传入参数 other_user_id=？？？

/*
getUserInfo:获取用户信息
getUserSubmit:获取用户提交记录,多次调用以获取全部记录
set50Permission:设为 已注册
set100Permission:设为 审核员
gotoDetail:跳转到商品详情页面
 */
const app=getApp()
Page({
  //data
  data: {
    other_user_id:null,
    user_info:null,//其他用户的个人信息 {user_name:'xx',.....}
    goods_list:[],//商品列表
    canSetUserPermission: false,//当自己权限>=150&&他人权限<150时为true，可调用setUserPermission(...)提权
    canSet50Permission: false,//能否设为 已注册 若可以，调用 set50Permission()
    canSet100Permission:false,//能否设为 审核员 若可以，调用 set100Permission()
    end_goods_id:-1,
  },

  getUserInfo:function(id){//获取用户信息
    //成功后设置this.data.user_info 
    //调用格式: this.getUserInfo(id).then(res=>console.log('success')).catch(err=>console.log('fail'))
    const that=this;
    return new Promise((resolve,reject)=>{
      app.qkpost('user/getUserInfo.php', {"other_user_id":id-0}).then((res)=>{
        that.setData({
          user_info:res
        })
        return resolve(res)
      }).catch(()=>reject('获取他人信息失败'))
    })
  },

  getUserSubmit:function(id){//获取用户提交记录,多次调用以获取全部记录
  //成功调用后设置this.data.goods_list
  //调用格式：this.getUserSubmit(id).then(res=>console.log('success')).catch(res=>consle.log('error'))
    var data={
      summary_sub: 20,//返回的商品数量
      count: 10,//返回的商品数量
      from_id:this.data.end_goods_id,
      type:0,
      other_user_id:id,
    }
    return new Promise((resolve,reject)=>{
      if(this.data.end_goods_id===null)return resolve(0);
      app.qkpost('user/getUserSubmit.php',data).then(res=>{
        var arr=[];
        if(this.data.end_goods_id<0){//第一次请求，数组重置
          arr=res.goods_list
        }else arr=this.data.goods_list.concat(res.goods_list)
        var end_goods_id=res.goods_list.length?res.end_goods_id:null;
        this.setData({
          goods_list: arr,
          end_goods_id: end_goods_id
        })
        return resolve(res.goods_list.length)//返回商品列表长度
      }).catch(err=>reject(err));
    })
  },
  setUserPermission: function (target_user_id, permission_level){//设置用户权限
    return new Promise((resolve,reject)=>{
      var data={
        target_user_id: target_user_id,
        permission_level: permission_level,
      }
      aqq.qkpost('manage/setUserPermission.php',data).then(res=>{
        if(res.status==0)return resolve()
        else return reject('没有权限进行操作');
      })
    })
  },
  set50Permission:function(){//设为 已注册
    return new Promise((resolve,reject)=>{
      this.setUserPermission(this.data.other_user_id,50).then(res=>resolve()).catch(res=>reject())
    })
  },
  set100Permission: function () {//设为 审核员
    return new Promise((resolve, reject) => {
      this.setUserPermission(this.data.other_user_id, 100).then(res => resolve()).catch(res => reject())
    })
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {//get id
    const id=options.other_user_id-0
    this.setData({
      other_user_id:id
    })
    this.getUserInfo(id).then(res=>{//获取个人信息
    if(app.globalData.user_info.user_permission>=150&&this.data.user_info.user_permission<150){//能否更改权限
      this.setData({
        canSetUserPermission:true
      })
      if (this.data.user_info.user_permission==50)this.setData({"canSet100Permission":true})
      else if (this.data.user_info.user_permission == 100)this.setData({ "canSet50Permission": true })
    }
      this.getUserSubmit(id).then(res=>{//获取第一批商品列表
        console.log('load success')
      })
    })
  },
  gotoDetail:function(goods_id){//跳转到商品详情页面
    wx.navigateTo({
      url: '../goods/detail/detail?id='+goods_id
    })
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

})