// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前输入的文字数
    num:0,
    content:"",
    loadContent:"",
    //当前任务的id
    targetId:"",
    //当前任务在前一个界面的索引值
    targetIndex:0
  },
  inputRecord:function(e){
    this.setData({content:e.detail.value, num:e.detail.cursor});
    // console.log(this.data.content, this.data.num);
  },
  confirm:function(){
    //确认提交
    this.setData({loadContent:"正在拼命加载中..."})
    var db = wx.cloud.database();
    var that = this;
    //完成后添加打卡记录
    db.collection('record').add({
      //添加打卡记录
      data: {
        target_id: this.data.targetId,
        time: new Date(),
        content: this.data.content == "" ? "这个人很懒，什么都不想记录~" : this.data.content
      }
    }).then(res=>{
      this.setData({loadContent:""});
      // console.log(res);
      let pages = getCurrentPages();
      let homePage = pages[pages.length - 2];
      homePage.setData({ currentTargetIndex: this.data.targetIndex, originPage: "record", 
      originPageTargetId: this.data.targetId});
      wx.navigateBack({});
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = 0;
    console.log(options.index);
    if (typeof (options.index) != undefined){
      index = options.index;
    }
    this.setData({targetId:options.targetId, targetIndex:index});
    console.log(options.targetId,index);
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