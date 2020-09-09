// pages/clock/clock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //目标的id
    targetId:"",
    //目标的索引
    targetIndex:0,
    //目标的持续时间
    min:0,
    second:0,
    //计时器
    interval:null,
    title:"一分一秒，皆是你专注的时光",
    //当是否已经发过提醒
    warningFlag:false,
    //计时结束标志
    complete:false,

    informContent:''
  },

  giveUp:function(){
    //清楚计时器
    clearInterval(this.data.interval);
    wx.navigateBack({});
  },

  warning:function(){
    //开始计时后，触碰手机发出提醒
    if(this.data.warningFlag||this.data.complete)return;
    this.setData({title:"专注！专注！", warningFlag:true});
    wx.vibrateShort({
      success:()=>{
        console.log("震动");
      },
      fail:()=>{
        console.log("该机型不支持震动");
      }
    });
    //3s后修改会其他语句
    var that = this;
    setTimeout(()=>{
      that.setData({title:"坚持就是胜利", warningFlag:false});
    },4000)
  },

  timer:function(interval){
    //计时器
    var second = this.data.second;
    var min = this.data.min;

    if(min == 0 && second==1){
      //计时结束
      clearInterval(this.data.interval);
      this.setData({complete:true});
      //打卡成功
      this.recordSuccess();
    }

    if(second == 0 && min>0){
      min-=1;
      second+=60;
    }

    second -= 1;
    this.setData({second:second, min:min});
  },

  recordSuccess:function(){
    //打卡成功后点击确定
    let pages = getCurrentPages();
    let homePage = pages[pages.length-2];
    homePage.setData({currentTargetIndex:this.data.targetIndex, originPage:"clock"});
    wx.navigateBack({});
    // wx.redirectTo({
    //   url: '../home/home?origin='+"timer&_id="+this.data.targetId,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //测试
    // options.duration = 5;
    var min = 0;
    var second =0;
    if(options.duration<=60){
      second = options.duration;
    }else{
      min = options.duration / 60;
    }
    this.setData({targetId:options.targetId, min:min, second:second, targetIndex:options.index});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var interval = setInterval(that.timer, 1000);
    this.setData({interval:interval});
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