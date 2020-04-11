// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    user:null,
    //当前选中的目标
    currentTarget:null,
    //是否打开左侧的选择栏
    leftOptionsFlag:false,
    //加载表示符，用于控制加载动画,当值为 "" 隐藏
    loadContent: "加载中...",
  },

  //初始化用户信息
  initUser: function(){
    const db = wx.cloud.database();
    const userTable = db.collection('user');
    let that = this;
    let app = getApp();
    userTable.get().then(res => {
      //判断是否注册
      if (res.data.length == 0) {
        console.log("用户还未注册");
        wx.navigateTo({
          url: '../register/register',
        })
      } else {
        //已注册
        console.log("已注册");
        this.setData({user:res.data[0]});
        app.globalData.user = res.data[0];
      }
      this.setData({ loadContent: '' });
    },err=>{
      console.log("加载用户信息错误");
      this.setData({loadContent:''});
    })
  },

  controlLeftOptions:function(){
    //控制左侧选择栏的开关
    if(this.data.leftOptionsFlag){
      this.setData({ leftOptionsFlag: false});
    }else{
      this.setData({ leftOptionsFlag: true});
    }
  },

  chooseTarget:function(e){
    //选择目标
    // console.log(e);
    this.setData({currentTarget:e.detail.target});
  },

  reachTo:function(e){
    //左侧选择栏的导航函数
    this.setData({ currentTarget: e.detail.target, loadContent:"正在路上..."});
    let target = e.currentTarget.dataset.target;
    console.log(target);
    let that = this;
    switch (target) {
      case '我的森林': {
        console.log('跳转到我的森林');
        that.setData({ loadContent: '' });
        break;
      }
      case'我的好友':{
         console.log('跳转至我的好友');
         wx.navigateTo({
           url: '../FriendSystem/FriendSystem',
           complete:function(){
             that.setData({loadContent: ''})
           }
         })
         break;
      }
      case '商城': {
        console.log('跳转到商城');
        wx.navigateTo({
          url: '../mall/mall',
          complete:function(){
            that.setData({ loadContent: ''});
          }
        })
        break;
      }
      default:{
        that.setData({ loadContent: '' });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUser();
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