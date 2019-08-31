const app = getApp();
var util = require("../../../../utils/util.js");
Page({
  data: {
    my_info:app.globalData.user_info,
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
        this.registerImage(this.data.tempFilePaths[0]).then((img_info)=>{
          console.log('register success')
          console.log(img_info)
          //图片上传(已经存在则忽略)
          this.upLoadImg(img_info.picture_id, this.data.tempFilePaths[0],img_info.picture_exist).
          then(()=>{
              console.log('success upload img')
              //设置头像
              this.setHeadImg(img_info.picture_id).then(()=>{
                console.log('success set Head')
                //updata user_info
                this.upDataUserInfo().then(()=>{
                  console.log('success updata user info')
                  wx.showToast({
                    title: "成功修改",
                    icon: 'success',
                    duration: 500,
                  })
                  setTimeout(wx.navigateBack,500)
                }).catch(()=>{
                  wx.showToast({
                    title: "头像设置失败",
                    icon: 'none',
                    duration: 500,
                  })
                  setTimeout(wx.navigateBack, 500)
                })
              })
          })
          
        })
      }
    }).catch(()=>{
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
  setHeadImg:function(img_id){//设置头像
    return new Promise((resolve,reject)=>{
      var data = util.base64_encode(JSON.stringify({ picture_id:img_id}))
      var timestamp = String(Date.parse(new Date()) / 1000)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.request({
        url: app.globalData.URL+'user/setUserAvatar.php',
        data: { "version": 1, "time": timestamp, "data": data, "sign": sign, "token": app.globalData.token },
        method: 'POST',
        header: { "content-type": "application/json" },
        success:res=>{
          if(res.data.status==0)return resolve();
          else return reject();
        }
      })
    })
  },
  upLoadImg:function(img_id,img_url,img_exist){//上传头像
    return new Promise((resolve,reject)=>{
      if (img_exist) return resolve(img_id);
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      wx.uploadFile({
        url: app.globalData.URL + "upload/uploadImage.php",
        filePath: img_url,
        name: 'file',
        formData: {
          version: 1,
          token: app.globalData.token,
          picture_id: img_id
        },
        success:res=>{
          if(JSON.parse(res.data).status==0){
            return resolve(img_id);
          }else return reject();
        }
      })
    })
  },
  registerImage:function(img_path){//注册头像
    return new Promise((resolve,reject)=>{
      //获取sh1
      wx.getFileInfo({
        filePath: img_path,
        digestAlgorithm:'sha1',
        success:res=>{
          var timestamp = String(Date.parse(new Date())/1000);
          var data = { "picture_sha1": res.digest}
          data = JSON.stringify(data)
          data = util.base64_encode(data)
          var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
          //注册图片
          wx.request({
            url: app.globalData.URL + "upload/registerImage.php",
            data:{
              "version": 1,
              "time": timestamp,
              "data": data,
              "sign": sign,
              "token": app.globalData.token
            },
            method: 'POST',
            header: {"content-type": "application/json"},
            success:res=>{
              res=JSON.parse(util.base64_decode(res.data.data))
              return resolve(res)
            }
          })
        }
      })//end get file
    })
  },
  upLoadBaseInfo:function(){//上传用户基础信息
    return new Promise((resolve,reject)=>{
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
          console.log(res)
          if (res.data.status == 0) return resolve();
          else return reject();
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
    else if (info.user_wechat && /\s/.test(info.user_wechat))err="微信号含有空白符"
    //tele 简单校验
    else if (info.user_phone && ! /^[\d]+$/.test(info.user_phone))err="电话号码不全为数字"

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
      my_info:app.globalData.user_info
    })
    var my_info = this.data.my_info
    if(my_info.user_school_name==null){
      my_info.user_school_name='请选择学校'
      this.setData({my_info})
    }
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
  
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})