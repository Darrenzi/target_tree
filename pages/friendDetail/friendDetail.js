// pages/friendDetail/friendDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zoom:1,
    currentShow:"森林",
    user:null,
    //用户目标
    targets:[],
    loadContent:"加载中...",
    informContent:"",
    //当前显示详情的目标的索引
    currentShowDetail:-1,

    //当前月份
    month: 0,
    //当前年份
    year: 2020,

    //统计目标的数据
    completed:0,
    abandoned:0,
    running:0,

    //滑动开始的X坐标,森林的滑动切换
    forestTouchStartX: 0
  },

  backHome: function () {
    wx.navigateBack({});
  },

  choose:function(e){
    let target = e.currentTarget.dataset.target;
    this.setData({currentShow:target});
  },

  nextMonth: function () {
    let month = this.data.month;
    let year = this.data.year;
    if (month < 12) {
      this.setData({ month: month + 1 });
    } else {
      this.setData({ year: year + 1, month: 1 });
    }
    this.getTargets();
  },

  lastMonth: function () {
    let month = this.data.month;
    if (month > 1) {
      this.setData({ month: month - 1 });
    } else {
      this.setData({ year: this.data.year - 1, month: 12 });
    }
    this.getTargets();
  },

  forestTouchStart: function (e) {
    //监听森林上的滑动,用于滑动切换判断
    // console.log(e);
    this.setData({ forestTouchStartX: e.touches[0].pageX });
  },

  forestTouchEnd: function (e) {
    //监听森林上的滑动,用于滑动切换判断
    // console.log(e);
    let endX = e.changedTouches[0].pageX;
    let startX = this.data.forestTouchStartX;
    let distance = endX - startX;
    // console.log(distance);
    if (distance > 0) {
      this.lastMonth();
    } else {
      this.nextMonth();
    }
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

  getDateField: function (year, month) {
    //获得一个月的第一天以及最后一天
    let firstdate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    let lastdate = new Date(year, month, 0, 23, 59, 59, 59);
    console.log(firstdate, lastdate);
    return {
      firstDay: firstdate,
      lastDay: lastdate
    }
  },

  getTargets: function () {
    this.setData({loadContent:"获取树苗中..."})
    //获取用户某个月的目标
    let userId = this.data.user.userId;
    // console.log(userId);
    let that = this;
    let month = this.data.month;
    let year = this.data.year;
    let dateField = this.getDateField(this.data.year, this.data.month);
    wx.cloud.callFunction({
      name:"getFriendTargets",
      data:{
        userId: userId,
        dateField:dateField,
      },
      success:function(res){
        console.log(res);
        that.getTreeImage(res.result.list);
        that.getStatistics(res.result.list);
        that.setData({targets:res.result.list, loadContent:''});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  getStatistics: function (targets) {
    //统计完成还有枯萎的树木的总量
    let completed = 0;
    let abandoned = 0;
    let running = 0;

    for (let i = 0; i < targets.length; i++) {
      if (targets[i].status == -1) {
        abandoned += 1;
      }
      if (targets[i].status == 1) {
        completed += 1;
      }
      else {
        running += 1;
      }
    }
    this.setData({ statistics: { completed: completed, abandoned: abandoned, running: running } });
  },


  watch:function(e){
    let index = e.currentTarget.id;
    this.setData({informContent:"此功能正在完善中"})
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
    //获取当前的时间
    let date = new Date();
    this.setData({ year: date.getFullYear(), month: date.getMonth() + 1, user: options});
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