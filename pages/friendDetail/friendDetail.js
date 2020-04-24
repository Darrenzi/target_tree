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
    //当前显示详情的目标的索引
    currentShowDetail:-1
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
    let userId = this.data.user.userId;
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
    this.setData({informContent:"此功能正在完善中..."})
  },

  showDetail:function(e){
    //显示一个目标的详情
    let index = e.currentTarget.id;
    // console.log(index);
    let currentShowDetail = this.data.currentShowDetail;
    if(currentShowDetail != index){
      this.setData({ currentShowDetail:index});
    }
    else{
      this.setData({ currentShowDetail: -1 });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({user:options});
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