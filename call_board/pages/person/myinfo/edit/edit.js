const app = getApp();
var util = require("../../../../utils/util.js");
var uploadImg=require('../../../../uploadImg.js')
Page({
  data: {
    my_info_cpy: app.globalData.user_info,
    my_info:{},
    sex: ['未知','男', '女'],
    tempFilePaths: "/images/add.png",
    errorInputMsg:'需完善信息才能成功保存',

  },
  change_name(e){
    var my_info = this.data.my_info
    my_info.user_name = e.detail.value
    this.setData({my_info})
  },
  change_sex(e) {
    var my_info = this.data.my_info
    my_info.user_sex = this.data.sex[e.detail.value]
    this.setData({my_info})
  },
  change_wx(e) {
    var my_info = this.data.my_info
    my_info.user_wechat = e.detail.value
    this.setData({my_info})
  },
  change_qq(e) {
    var my_info = this.data.my_info
    my_info.user_qq = e.detail.value
    this.setData({my_info})
  },
  change_phone(e) {
    var my_info = this.data.my_info
    my_info.user_phone = e.detail.value
    this.setData({my_info})
  },
  get_user_info(e){
    var my_info = this.data.my_info
    my_info.user_name = e.detail.userInfo.nickName
    my_info.user_sex = this.data.sex[e.detail.userInfo.gender]
    this.setData({my_info})
    app.globalData.user_info_wx = e.detail.userInfo
  },

  //将个人信息上传到服务器
  save:function(){
    wx.showToast({
      title: '上传中',
      icon:'loading',
      mask:true
    })
    console.log('upload info')
    console.log(this.data.tempFilePaths)
    this.upLoadBaseInfo().then(()=>{
      //upLoadBaseInfo设置成功
      console.log('success upload base info')
      //上传头像,判断是否上传头像
      if(typeof(this.data.tempFilePaths)!=typeof([])){
        //更新信息直接退出
        console.log('未设置头像')
        this.upDataUserInfo().then(() => {
          console.log('success updata user info')
          wx.showToast({
            title: "成功修改",
            icon: 'success',
            duration: 500,
          })
          setTimeout(wx.navigateBack, 500)
        })
        //return;
      }else{//上传了头像
        //注册头像
        uploadImg.registerCOSImage(this.data.tempFilePaths[0]).then(res=>{
          console.log('头像')
          console.log(res)
          app.qkpost('user/setUserAvatar.php', { picture_id:res-0}).then(res=>{
            if(res.status==0){
              wx.showToast({
                title: '修改成功',
                duration:500
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 2
                })
              },500)
            }else{
              wx.showToast({
                title: '修改失败',
              })
            }
          })
        })
      }
    }).catch((err)=>{
      //upLoadBaseInfo设置错误
      wx.showToast({
        title: this.data.errorInputMsg,
        icon:'none',
        duration:3000
      })
    })
  },
  upDataUserInfo:function(){
    return new Promise((resolve,reject)=>{
      var data = "";
      var timestamp = String(Date.parse(new Date()) / 1000)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.request({
        url: app.globalData.URL + 'user/getUserInfo.php',
        data: { "version": 1, "time": timestamp, "data": data, "sign": sign, "token": app.globalData.token },
        method: 'POST',
        header: { "content-type": "application/json" },
        success:res=>{
          if(res.data.status==1)return reject();
          else{
            res=JSON.parse(util.base64_decode(res.data.data))
            app.globalData.user_info=res;
            return resolve()
          }
        }
      })
    })
  },
  upLoadBaseInfo:function(){//上传用户基础信息
    return new Promise((resolve,reject)=>{
      if (!this.data.my_info.user_name) this.data.my_info.user_name = this.data.my_info_cpy.user_name
      if (!this.data.my_info.user_wechat) this.data.my_info.user_wechat = this.data.my_info_cpy.user_wechat
      if (!this.data.my_info.user_qq) this.data.my_info.user_qq = this.data.my_info_cpy.user_qq
      if (!this.data.my_info.user_phone) this.data.my_info.user_phone = this.data.my_info_cpy.user_phone
      this.setData({
        my_info:this.data.my_info
      })
      //check info
      console.log('start check')
      if (this.checkInfo(this.data.my_info) == false) return reject();
      console.log('pass test,start upload base info')
      //upload
      var data = util.base64_encode(JSON.stringify(this.data.my_info))
      console.log(this.data.my_info)
      var timestamp = String(Date.parse(new Date()) / 1000)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.request({
        url: app.globalData.URL + "user/setUserInfo.php",
        data: { "version": 1, "time": timestamp, "data": data, "sign": sign, "token": app.globalData.token },
        method: 'POST',
        header: { "content-type": "application/json" },
        success: res => {
          if (res.data.status == 0) return resolve();
          else{
            this.data.errorInputMsg ="错误的输入！"
            return reject();
          }
        }
      })
    })
  },
  checkInfo:function(info){//校验个人信息
    let err=""
    console.log('start check info')
    //昵称
    if (/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig.test(info.user_name))err="昵称不能含有 emoji 😥"
    if (/\s/.test(info.user_name))err="昵称含有空白符"
    else if(!info.user_name)err="昵称为空"
    else if (info.user_name.length>10)err="昵称长度大于10"
    //QQ
    else if ( info.user_qq && /[^\d]/.test(info.user_qq))err="QQ号不全为数字"
    //wx
    else if (info.user_wechat && ! /^[a-z0-9\-\_]+$/i.test(info.user_wechat))err="微信号格式错误"
    //tele 简单校验
    else if (info.user_phone && ! /^[\d]+$/.test(info.user_phone))err="电话号码不全为数字"
    else if (!(info.user_qq || info.user_wechat || info.user_phone))err="微信 qq 电话 不能全为空"
    if(err=="")return true;
    else{
      this.setData({
        errorInputMsg:err
      })
      return false;
    }
  },
  onLoad: function (options) {
    this.setData({
      my_info_cpy:app.globalData.user_info,
      my_info: { 
        "user_name": '',
         "user_sex": app.globalData.user_info.user_sex,
        "user_phone": '',
        "user_qq":'',
        "user_wechat":'',
        }
    })
    /*var my_info = this.data.my_info_cpy
    if(my_info_cpy.user_school_name==null){
      my_info_cpy.user_school_name='请选择学校'
      my_info.user_school_name = '请选择学校'
      this.setData({my_info})
      this.setData({ my_info_cpy })
    }*/
  },

  change_parent_data: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.change_data();//触发父页面中的方法
    }
  },
  chooseimage:function(){
    var _this = this;
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        _this.setData({
          tempFilePaths:res.tempFilePaths
        })
      },
    })
  },
  
 
})