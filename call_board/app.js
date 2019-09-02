
var util = require("utils/util.js");
App({
  onLaunch: function(options) {
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    });
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    // 登录
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    new Promise((resolve,reject)=>{
      wx.login({
        success: res => {
          var login_data = {
            "wechat_login_token": res.code
          }
          login_data = JSON.stringify(login_data)
          login_data = util.base64_encode(login_data)
          var sign = util.sha1(login_data + timestamp)
          wx.request({
            url: that.globalData.URL + "user/login.php",
            data: {
              "version": 1,
              "time": timestamp,
              "data": login_data,
              "sign": sign,
              "token": null
            },
            method: 'POST',
            header: {
              "content-type": "application/json"
            },
            success: res => {
              try {
                console.log('succe:')
                console.log(res)
                var res_data = util.base64_decode(res.data.data)
                console.log('res_data')
                console.log(res_data)
                res_data = JSON.parse(res_data)
                that.globalData.token = res_data.token
                that.globalData.user_info = res_data.user_info
                wx.hideLoading()
                if (this.getInfoCallback) {
                  //data 为需要传入的数据
                  this.getInfoCallback(that.globalData.user_info)
                }
                return resolve();
              } catch (err) {
                console.log('err')
                console.log(err)
                for(let e in err)console.log(e+":"+err[e])

                wx.hideLoading()
                /*wx.showModal({
                  title: '登陆失败',
                  showCancel: false
                })*/
                //第二次请求
                a
                //--------
                return reject();
                //console.log(res.data)
              }
            }
          })
        }
      })
    }).then(()=>{
      wx.showLoading({
        title: '获取信息中',
        mask: true
      })
      this.upDataUserInfo().then(()=>{
        wx.showToast({
          title: '登录成功',
          duration:500
        })
      }).catch(()=>{
        wx.showToast({
          title: '个人信息获取失败！',
          mask: true
        })
      })
    })
  },
  globalData: {
  
    user_info: null,
    user_info_wx: null,
    token: "token",
    URL: "https://xcx.natal.tech/HighSchoolMarket/api/interface/",
  },
  upDataUserInfo: function () {
    return new Promise((resolve, reject) => {
      var data = "";
      var timestamp = String(Date.parse(new Date()) / 1000)
      var sign = util.sha1(data + timestamp + this.globalData.user_info.user_id)
      wx.request({
        url: this.globalData.URL + 'user/getUserInfo.php',
        data: { "version": 1, "time": timestamp, "data": data, "sign": sign, "token": this.globalData.token },
        method: 'POST',
        header: { "content-type": "application/json" },
        success: res => {
          if (res.data.status == 1) return reject();
          else {
            res = JSON.parse(util.base64_decode(res.data.data))
            this.globalData.user_info = res;
            return resolve()
          }
        }
      })
    })
  },
  qkpost: function (url, data,withNoToken) {//封装wx.request
    //url:相对路径
    //data:{}
    //withNoToken : 默认 undefined 为需要token
    return new Promise((resolve, reject) => {
      if(data){
        data = JSON.stringify(data)
        data = util.base64_encode(data)
      }
      var timestamp = String(Date.parse(new Date()) / 1000)
      var sign = withNoToken ? util.sha1(data + timestamp) : util.sha1(data + timestamp + this.globalData.user_info.user_id)
      wx.request({
        url: this.globalData.URL + url,
        data: {
          "version": 1,
          "time": timestamp,
          "data": data,
          "sign": sign,
          "token": withNoToken ? null : this.globalData.token
        },
        method: 'POST',
        header: { "content-type": "application/json" },
        success: res => {
          if (res.data.status == 1) return reject(res);
          else try{//data是否能转为{}
            res = JSON.parse(util.base64_decode(res.data.data))
            return resolve(res)
          }catch(ex){
            try{//是否有data属性
              return resolve(res.data)
            }catch(ex){
              return resolve(res)
            }
            
          }
        },
      })//end request
    })
  }
})