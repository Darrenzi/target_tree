// pages/friendDetail/friendDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zoom:0.38,
    currentShow:"森林",
    user:null,
    //用户目标
    targets:[],
    loadContent:"加载中...",
    informContent:"",
  },

  backHome: function () {
    wx.navigateBack({});
  },

  choose:function(e){
    let target = e.currentTarget.dataset.target;
    this.setData({currentShow:target});
  },

  getTreeImage:function(targetData){
    // console.log(targetData);
    //根据任务进度判断树木的图片
    let forest = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    for (let i = 0; i < targetData.length; i++) {
      //根据任务的进度压入不同的树木图片
      if (targetData[i].progress < 30) {
        forest[i] = targetData[i].tree[0].path[0];
      }
      else if (targetData[i].progress < 60) {
        forest[i] = targetData[i].tree[0].path[1];
      }
      else if (targetData[i].progress < 90) {
        forest[i] = targetData[i].tree[0].path[2];
      }
      else {
        forest[i] = targetData[i].tree[0].path[3];
      }
    }
    // console.log(forest);
    this.setData({forest:forest});
  },

  getTargets: function () {
    let userId = this.data.user._openid;
    // console.log(userId);
    let that = this;
    wx.cloud.callFunction({
      name:"getFriendTargets",
      data:{
        userId: userId
      },
      success:function(res){
        console.log(res);
        that.getTreeImage(res.result.list);
        that.setData({targets:res.result.list, loadContent:''});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  watch:function(e){
    let index = e.currentTarget.id;
    console.log(index, e)
    this.setData({informContent:"此功能正在完善中..."})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    this.setData({user:app.globalData.user});
    this.getTargets();
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