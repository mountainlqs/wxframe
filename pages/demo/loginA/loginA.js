//pages/demo/login/login.js
//var base = require('../../base/base.js');
//var Bmob = require('../../utils/Bmob-1.7.0.min.js');
//Bmob.initialize("54fa4aab3587fefad2709bfcfcb9d0e3", "834fb077f62c14ebf5373c09f8a2a134");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   * 此页面要用到的变量定义在这个函数里
   */
  data: {
    username: "",
    pwd: "",
  },
  /**
   * 获取输入框内容函数
   * 输入框中内容会自动赋值给data中已经定义的变量
   */
  textinput: function (event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        username: event.detail.value
      })
    } else {
      this.setData({
        pwd: event.detail.value
      })
    }
  },
  login: function(){
       wx.showToast({
      title: '登录中...',
      icon: 'loading',
      mask: true // 遮罩层，设置为true
    })
    let token = this.data.username + ":" + this.data.pwd;
    wx.setStorageSync('token', this.toBase64(token));
    app.WxService.request("/system/principal?wechatFlag=true", 'GET', { wechatFlag: true })
    //app.WxService.request("/user/login?username=1&password=1", 'GET', {  })
      .then(res => {
        console.log(res)
        app.globalData.userInfo = res;
        wx.hideToast(); 
        wx.showToast({
            title: "登录成功",
            icon: 'success',
            duration: 2000
          })
       
  })
  },
  //  login: function () {
  //       var that = this;
  //   // var url = "http://58.213.23.244:8007/dhc_rt/a/login?username=szadmins&password=123456&mobileLogin=true";
  //   //  var url = app.globalData.SERVERHOST + app.globalData.ADDRRES + "/a/login?username=szadmins&password=123456&mobileLogin=true";
  //   // var url = app.globalData.AppConfig.SERVERHOST + app.globalData.AppConfig.ADDRRES + "/a/login?__ajax=true&username=" + that.data.username + "&password=" + that.data.pwd + "&mobileLogin=true";
  //    var url = app.globalData.AppConfig.SERVERHOST + app.globalData.AppConfig.ADDRES + "/user/login?username=1&password=1";
  //   wx.showToast({
  //     title: '登录中...',
  //     icon: 'loading',
  //     mask: true // 遮罩层，设置为true
  //   })
  //   //  Bmob.User.login('test','123456').then(res=>{
  //   //    console.log(res)
  //   //  }).catch(err=>{
  //   //    console.log(err)
  //   //  })
  //   let token = that.data.username + ":" + that.data.pwd;
  //  // var url = app.globalData.AppConfig.SERVERHOST + app.globalData.AppConfig.ADDRRES + "/system/principal?wechatFlag=true&Authorization=" + this.toBase64(token);
  //   wx.request({
     
  //     url: url,
  //     method: "GET",
  //     data: {//需要将请求参数进行post封装时，在此定义
  //       // username: that.data.username,
  //       // password: that.data.pwd,
  //       // mobileLogin: "true"
  //       'Authorization': 'Basic ' + this.toBase64(token)
  //     },
  //     header: {

  //       // 'content-type': 'application/json'

  //       'Content-Type': 'json'

  //     }, 
  //     complete: function (res) {
  //       console.log(res);
  //       // wx.hideToast();            
  //       if (res.data.resultStatus == 600) {

  //         wx.showToast({
  //           title: "登录成功",
  //           icon: 'success',
  //           duration: 2000
  //         })
  //         app.globalData.JSESSIONID = res.data.data.sessionid
  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: res.data.data.message
  //         })
  //       }
  //       app.mine();
  //       app.likelist();
  //       if (that.data.linktype == 1) {
  //         wx.navigateBack({
  //           delta: 1
  //         })
  //       }
  //       else if (that.data.linktype == 2) {
  //         wx.redirectTo({
  //           url: that.data.url
  //         })
  //       } else {
  //         wx.switchTab({
  //           url: '../home/index'
  //         });
  //       }

  //     }
  //   })
  // },
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

  },
  /**
     * StringtoBase64
     */
    toBase64(data) {
    var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var base64Pad = '=';
    var result = '';
    var length = data.length;
    var i;
    // Convert every three bytes to 4 ascii characters.  
    for (i = 0; i < (length - 2); i += 3) {
      result += toBase64Table[data.charCodeAt(i) >> 2];
      result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
      result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
      result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
    }
    // Convert the remaining 1 or 2 bytes, pad out to 4 characters. 
    if (length % 3) {
      i = length - (length % 3);
      result += toBase64Table[data.charCodeAt(i) >> 2];
      if ((length % 3) == 2) {
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
        result += base64Pad;
      } else {
        result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
        result += base64Pad + base64Pad;
      }
    }
    // console.log(result);
    return result;
  }
})