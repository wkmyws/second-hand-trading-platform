const app = getApp()
var COS = require('./cos-wx-sdk-v5.js')
var cos = new COS({
  SecretId:'AKIDcBYmpcLj4990hAxPRSHaeS6WheMrYans',
  SecretKey: '1nOksZ2UihRVMxwjYAWeXFkiz0rSqztX',
});
//upImg
function registerCOSImage(image_url){//return id
  return new Promise((resolve,reject)=>{
  //后缀
  var houZhui;
  image_url.replace(/.([a-z]+)$/i, function (all, h) { houZhui = h })
  //get more
  wx.getFileInfo({
    filePath: image_url,
    digestAlgorithm: 'sha1',
    success(res) {
      //sha1
      var image_sha1 = res.digest.toUpperCase()
      //检测是否存在图片
      app.qkpost('upload/checkCOSImage.php', { picture_sha1:image_sha1},'NoToken').then(res=>{
        if (res.picture_exist) return resolve(res.picture_id)
        else{//注册
          //date
          var currentDate = new Date()
          var year = currentDate.getFullYear()
          var month = currentDate.getMonth() + "";
          month = month.length == 1 ? "0" + month : month;
          var day = currentDate.getDate() + "";
          day = day.length == 1 ? "0" + day : day;
          //id
          var userId = app.globalData.user_info.user_id
          //contact()
          var key = "" + image_sha1.toUpperCase() + "_" + year + '-' + month + '-' + day + '_' + userId + '.' + houZhui
          cos.postObject({
            Bucket: 'xcx-1259024247',
            Region: 'ap-shanghai',
            Key: "img/" + key,
            FilePath: image_url,
            onProgress: function (info) {
              console.log(JSON.stringify(info));
            }
          }, function (err, data) {
            app.qkpost('upload/registerCOSImage.php',
              { picture_sha1: image_sha1, picture_file_name: key }).then(res => {
                return resolve(res.picture_id)
              })
          });//cos post
        }
      })
    }//success
  })//get info
  })//promise
}

function upLoadImg(maxCount){
  var maxCount=maxCount||1;
  wx.chooseImage({
    count: maxCount, // 默认9
    sizeType: ['original'], // 可以指定是原图还是压缩图，默认用原图
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {

      var filePath = res.tempFiles[0].path;
      registerCOSImage(filePath).then(res=>{
        console.log(res)
      })

    }
  });
}

module.exports={
  registerCOSImage: registerCOSImage
}

upLoadImg()