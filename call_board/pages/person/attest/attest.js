const app = getApp()
var util = require("../../../utils/util.js");
Page({
  data: {
    doneSend:false,
    selected_school: '南京审计大学',
    mail_example: null,
    college: [],
    popup: true,
    college_list: null,
    mail_addr: null,
    id: null,
    site:[
      "http://mail.stu.nau.edu.cn"
    ]
  },
  exec(){
    app.onLaunch()
    setTimeout(this.backTo,1000)
  },
  ChangeCollege(e) {
    var that = this
    this.setData({
      selected_school: this.data.college[e.detail.value]
    })

    var mail_example = []
    for (var sch in that.data.college_list) {
      if (that.data.college_list[sch].school_name == that.data.selected_school) {
        for (var mail in that.data.college_list[sch].email_address) {
          mail_example.push(that.data.college_list[sch].email_address[mail])
        }
      }
    }
    if (that.data.selected_school == '南京审计大学') {
      var mail_addr = mail_example[1]
    } else {
      var mail_addr = mail_example[0]
    }
    this.setData({
      mail_example,
      mail_addr
    })
  },

  hidePopup(flag = true) {
    this.setData({
      "popup": flag
    });
  },

  showPopup() {
    this.hidePopup(false);
  },

  onLoad: function() {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var data = {}
    data = JSON.stringify(data)
    data = util.base64_encode(data)
    var sign = util.sha1(data + timestamp)
    wx.request({
      url: app.globalData.URL + "school/getSupportSchoolList.php",
      data: {
        "version": 1,
        "time": timestamp,
        "data": data,
        "sign": sign,
        "token": null
      },
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        var res_data = util.base64_decode(res.data.data)
        res_data = JSON.parse(res_data)
        that.setData({
          college_list: res_data
        })
        //获取学校名称列表
        var list = []
        for (var i in that.data.college_list) {
          list.push(that.data.college_list[i].school_name)
        }
        //获取邮箱示例
        var mail_example = []
        for (var sch in that.data.college_list) {
          if (that.data.college_list[sch].school_name == that.data.selected_school) {
            for (var mail in that.data.college_list[sch].email_address) {
              mail_example.push(that.data.college_list[sch].email_address[mail])
            }
          }
        }
        //console.log(mail_example)
        that.setData({
          college: list,
          mail_example,
          mail_addr: mail_example[1]
        })
      }
    })

  },
  mail_change: function(e) {
    this.setData({
      mail_addr: this.data.mail_example[e.detail.value]
    })
  },
  id_input: function(e) {
    this.setData({
      id: e.detail.value
    })
  },
  find_id: function(sch_name) {
    var that = this;
    for (var sch_id in that.data.college_list) {
      if (that.data.college_list[sch_id].school_name == that.data.selected_school) {
        return parseInt(sch_id)
      }
    }
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
  mail_send: function() {
    var that = this;
    var re = /^1\d{7,9}$/;
    if (re.test(that.data.id)) {
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      var data = {
        "school_id": (that.find_id(that.data.selected_school)),
        "email_address": that.data.id + '@' + that.data.mail_addr
      }
      data = JSON.stringify(data)
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp + app.globalData.user_info.user_id)
      wx.showLoading({
        title: '正在发送邮件',
        mask:true
      })
      wx.request({
        url: app.globalData.URL + "school/sendIdentificationEmail.php",
        data: {
          "version": 1,
          "time": timestamp,
          "data": data,
          "sign": sign,
          "token": app.globalData.token
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          wx.hideLoading()
          if (res.data.status == 0) {
            wx.showToast({
              title: '验证邮件发送成功',
              icon: 'none',
            })
            this.setData({
              doneSend:true,
            })
          } else {
            wx.showModal({
              title: '验证邮件发送失败',
              content: res.data.err_msg,
              showCancel:false
            })
          }
        }
      })


    } else {
      wx.showToast({
        title: '学号输入有误',
        icon: 'none',
      })
    }
  },
  backTo: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})