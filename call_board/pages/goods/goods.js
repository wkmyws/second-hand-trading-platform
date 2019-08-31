var util = require('../../utils/util.js');
const app = getApp()
const ct_num = 9; //每页显示的最大条数
Page({
  data: {
    navScrollLeft: 0, //顶部栏的左边置左
    swiperH: '', //广告牌
    swiperIndex: 0,
    isPopping: false, //是否已经弹出     
    navData: [], //顶部栏的内容
    currentTab: 0,
    scrollTop: 0,
    showView: true,
    imgUrls: [
      "http://xcx.nau.edu.cn/images/school5.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school4.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school7.jpg?" + Math.random() / 9999,
      "http://xcx.nau.edu.cn/images/school6.jpg?" + Math.random() / 9999
    ], //广告牌的图片
    note: [], //瀑布流的样式数据
    searchContent: '', //搜索内容
    last_id: -1, //拉取的最后一个商品id
    search_from: 1, //	从第几个搜索结果继续搜索（>=0，从头开始为1）
    images: [], //预加载图片
    colHgt: 0, //两栏的高度差
    loadingCount: 0,
    col1: [],
    col2: [],
    imgWidth: 120,
    cardMargin: 210 / 750 * wx.getSystemInfoSync().windowWidth,
    //每个卡片的边距 210怎么得出来的？玄学！
  },
  onImageLoad: function(e) {
    let maxLength = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height > maxLength ? maxLength : e.detail.height; //图片原始高度
    //let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let imgWidth = (wx.getSystemInfoSync().windowWidth - 7 * 10 / 750 * wx.getSystemInfoSync().windowWidth) / 2;
    //7*10怎么得出来的？别问，问就是玄学！
    let imgHeight = oImgH * imgWidth / oImgW;
    imgHeight += this.data.cardMargin; //卡片加上边距
    console.log('card margin:::' + this.data.cardMargin)
    let imageId = e.currentTarget.id;
    let images = this.data.images;
    let imageObj = null;
    for (let i = 0; i < images.length; i++) {
      if (images[i].goods_id == imageId) {
        imageObj = images[i];
        break;
      }
    }

    this.data.loadingCount -= 1;
    //判断当前图片添加到左列还是右列
    if (this.data.colHgt >= 0) {
      this.data.colHgt -= imgHeight;
      this.data.col1.push(imageObj);
      console.log('col1')
      console.log(imageObj.goods_title)
      console.log(imgHeight)
      console.log(this.data.colHgt)
      this.setData({
        col1: this.data.col1
      })
    } else {
      this.data.colHgt += imgHeight;
      this.data.col2.push(imageObj);
      console.log('col2')
      console.log(imageObj.goods_title)
      console.log(imgHeight)
      console.log(this.data.colHgt)
      this.setData({
        col2: this.data.col2
      })
    }

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!this.data.loadingCount) {
      this.setData({
        images: []
      })
    }

  },
  loadImages: function(data, model) {
    let images = data;
    if (!model) {
      this.setData({
        colHgt: 0,
        col1: [],
        col2: [],
      })
    }
    this.setData({
      loadingCount: images.length,
      images: images
    });
  },
  jumpTo: function() {
    wx.navigateTo({
      url: '../goods/search/search?s=1',
    })
  },
  startSearch: function(e) { //搜索
    const searchContent = this.data.searchContent
    wx.navigateTo({
      url: '../goods/search/search?s=' + searchContent,
    })
  },
  bindInputSearch: function(e) {
    this.setData({
      searchContent: e.detail.value
    })
  },
  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading();

    var data = {
      "summary_sub": 20,
      "count_num": ct_num,
      "from_id": -1,
      "goods_type": this.data.navData[this.data.currentTab].type_id,
    }
    that.get_goods_list(data)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },
  //跳转至【商品发布】页面
  publish: function() {
    wx.navigateTo({
      url: '../publish/publish_goods/publish_goods',
    })
  },
  get_goods_list: function(data, model) { //model?继续添加：重新添加
    return new Promise((resolve, reject) => {
      var that = this;
      var timestamp = Date.parse(new Date());
      timestamp = String(timestamp / 1000);
      data = JSON.stringify(data)
      data = util.base64_encode(data)
      var sign = util.sha1(data + timestamp)
      wx.request({
        url: app.globalData.URL + "goods/getGoodsList.php",
        data: {
          "version": 1,
          "time": timestamp,
          "data": data,
          "sign": sign,
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: res => {
          if (res.data.status == 1) return reject();
          var res_data = JSON.parse(util.base64_decode(res.data.data))
          that.setData({
            //note: model?this.data.note.concat(res_data.goods_list):res_data.goods_list,
            last_id: res_data.end_goods_id
          })
          this.loadImages(res_data.goods_list, model)
          return resolve();
        }
      })
    })
  },
  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#eee'
    })

    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = String(timestamp / 1000);
    var sign = util.sha1("" + timestamp)
    wx.request({
      url: app.globalData.URL + "goods/getGoodsTypeList.php",
      data: {
        "version": 1,
        "time": timestamp,
        "data": "",
        "sign": sign,
      },
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        var res_data = util.base64_decode(res.data.data)
        res_data = JSON.parse(res_data)
        that.setData({
          navData: [{
            type_id: -1,
            type_name: '全部'
          }].concat(res_data)
        })
        //该cookie用于发布商品时传入选项类别
        wx.setStorage({
          key: 'goods_classes',
          data: res_data,
        })

        var dt = {
          "summary_sub": 100,
          "count_num": ct_num,
          "from_id": -1,
          "goods_type": this.data.navData[this.data.currentTab].type_id,
        }
        that.get_goods_list(dt)

      }
    })
  },

  switchNav(event) {
    var that = this
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    that.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
    }
    var data = {
      "summary_sub": 20,
      "count_num": ct_num,
      "from_id": -1,
      "goods_type": this.data.navData[cur].type_id,
    }
    that.get_goods_list(data)
  }, //顶部栏
  swiperChange: function(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  swiperAd: function() {
    wx.navigateTo({
      url: '../goods/advertise/advertise',
    })
  },
  onReady: function() { // 生命周期函数--监听页面初次渲染完成  
  },
  onShow: function() { // 生命周期函数--监听页面显示  
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏   
  },


  onReachBottom: function() {
    // 页面上拉触底事件的处理函数   
    if (!this.data.last_id) {
      wx.showToast({
        title: '我是有底线的！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var data = {
      "summary_sub": 20,
      "count_num": ct_num, //-------------------------
      "from_id": this.data.last_id,
      "goods_type": this.data.navData[this.data.currentTab].type_id
    }
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    })
    this.get_goods_list(data, 'continue_add').then(() => {
      wx.hideToast();
      //判断到底
      if (this.data.last_id == null) {
        wx.showToast({
          title: '我是有底线的！',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(() => {
      wx.showToast({
        title: '加载失败！',
        icon: 'none',
        duration: 2000
      })
    })
  },

  //发布按钮，下滑隐藏，上滑显示
  onPageScroll: function(event) {
    let scroll = event.scrollTop; //当前的距离顶部的高度
    let scrollTop = this.data.scrollTop; //记录的距离顶部的高度
    //下滑隐藏
    if (scroll - scrollTop > 40) {
      this.setData({
        showView: false,
        scrollTop: scroll
      })
    }
    //上滑显示
    else if (scroll - scrollTop < -10) {
      this.setData({
        showView: true,
        scrollTop: scroll
      })
    }
  }

})