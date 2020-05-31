// pages/loading/loading.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informContent:""
  },

  //初始化用户信息
  initUser: async function () {
    const db = wx.cloud.database();
    const userTable = db.collection('user');
    let that = this;
    let app = getApp();
    let registerFlag = false;
    await userTable.get().then(res => {
      //判断是否注册
      if (res.data.length == 0) {

        wx.navigateTo({
          url: '../register/register',
        })
      } else {
        //已注册
   
        app.globalData.user = res.data[0];
        registerFlag = true;
      }
    }, err => {
      that.setData({ informContent:"加载用户信息错误"});
    })
    return registerFlag;
  },

  judgeTheme:async function(){

    let registerFlag = await this.initUser();
    if(!registerFlag)return;//用户未注册，不需判断主题

    //判断用户的选中的主题进行页面跳转
    try {
      //获取用户选择的主题
      var theme = wx.getStorageSync('theme')
  
      if (theme == "") {
        //主题字段不存在,可能为新用户，也可能为缓存被清空
        theme = "white";
        wx.setStorage({
          key: "theme",
          data: "white"
        });
      }
      else if (theme == "green") {
        //主题字段为green，跳转到绿色主页
        wx.redirectTo({
          url: '../index/index',
        })
      }
      else{
        //主题字段为white，跳转到白色主页
        wx.redirectTo({
          url: '../home/home',
        })
      }
    } catch (err) {
      console.log(err);
      theme = "white";
      wx.setStorage({
        key: "theme",
        data: "white"
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.judgeTheme();
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