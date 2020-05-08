// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme:"white"
  },

  chooseTheme:function(e){
    console.log("e",e);
    this.setData({theme:e.detail.value});
  },

  bindGetUserInfo: function (e) {
    //显示加载动画
    this.setData({ loadingContent:"正在入库..."});
    //获取用户信息
    const db = wx.cloud.database();
    let that = this;
    let app = getApp();
    var userInfo = e.detail.userInfo;
    var nickName = userInfo.nickName;
    var avatarUrl = userInfo.avatarUrl;
    var gender = userInfo.gender; //性别 0：未知、1：男、2：女
    var province = userInfo.province;
    var city = userInfo.city;
    switch (gender) {
      case 0: {
        gender = "未知";
        break;
      }
      case 1: {
        gender = "男";
        break;
      }
      case 2: {
        gender = "女";
        break;
      }
    }
    city = province + ' ' + city;
    db.collection('user').add({
      data: {
        un: nickName,
        gender: gender,
        city: city,
        //头像图片
        avatarUrl: avatarUrl,
        phone: "",
        tools: ["42c9a7b15e9034250071852a36490bf9"],
        coin: 0
      },
      success: function (res) {
        // console.log(res);
        // 加入数据库成功，页面跳转
        db.collection('user').get().then(res => {
          app.globalData.user = res.data[0];
          // console.log(app.globalData.user);
          //清空加载动画
          that.setData({ loadingContent:''});
          //注册后跳转的界面,储存主题信息
          wx.setStorage({
            key: 'theme',
            data: that.data.theme
          })
          //根据主题跳转
          switch(that.data.theme){
            case "white":{
              wx.redirectTo({
                url: '../home/home',
              })
              break;
            }
            case "green":{
              wx.redirectTo({
                url: '../index/index'
              })
            }
          }
        })
      },
      fail:function(err){
        console.log(err);
        console.log("注册失败");
      }
    })
  },
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

  }
})