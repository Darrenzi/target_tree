// pages/friendDetail/friendDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zoom:1,
    currentShow:"森林",
    //目标拥有者
    targetUser:null,
    //用户目标
    targets:[],
    loadContent:"加载中...",
    informContent:"",
    //当前显示详情的目标的索引
    currentShowDetail:-1,
    //当前用户是否与目标用户已为好友的标识符
    judgeFriendFlag:false,
    //当前目标用户是否为用户自己
    himself:false,

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
    if (distance > 100) {
      this.lastMonth();
    }
    if (distance < -100) {
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
    let userId = this.data.targetUser.userId;
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

  targetDetail: function (e) {
    //跳转到某个目标的详情界面
    let index = e.currentTarget.id;
    let target = this.data.targets[index];
    let un = this.data.targetUser.un;
    let avatarUrl = this.data.targetUser.avatarUrl;
    let title = target.title;
    let content = target.content;
    let targetId = target._id;
    let like = target.like.toString();
    let _id = target._id;
    let supervisor = target.supervisor.toString();
    let progress = target.progress;
    wx.navigateTo({
      url: '../targetDetail/targetDetail?un=' + un + "&avatarUrl=" + avatarUrl +
        "&title=" + title + "&content=" + content + "&targetId=" + targetId + "&like=" + like + "&_id=" + _id + "&supervisor=" + supervisor + "&progress="+progress,
    })
  },

  judgeFriend:function(){
    //判断用户是否已经为好友
    let targetUser = this.data.targetUser;
    let user = getApp().globalData.user;
    if(targetUser.userId == user._openid){
      this.setData({judgeFriendFlag:true, himself:true});
      return;
    }
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    console.log(targetUser.userId, user._openid);
    db.collection('friend').where(_.or([
      {
        _openid: _.eq(targetUser.userId),
        sender: _.eq(user._openid)
      },
      {
        _openid: _.eq(user._openid),
        sender: _.eq(targetUser.userId)
      },
    ]))
    .get()
    .then(res => {
      console.log(res);
      if (res.data.length != 0) {
        //说明已互为好友
        this.setData({ judgeFriendFlag: true });
      }
    })
  },

  addFriend: function () {
    // this.setData({loadContent:"正在进入对方朋友圈..."})
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    let targetUser = this.data.targetUser;
    let user = getApp().globalData.user;
    db.collection('friendRequest').add({
      data: {
        //接受好友请求的用户
        receiver: that.data.targetUser.userId,
        //接受请求的用户是否已经处理，-1已拒绝，0未处理，1已同意
        status: 0,
        time: new Date()
      }
    })
      .then(res => {
        console.log(res);
        that.setData({
          informContent: "已为您发出好友请求",
          loadContent: ""
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //获取当前的时间
    let date = new Date();
    this.setData({ year: date.getFullYear(), month: date.getMonth() + 1, targetUser: options});
    this.getTargets();
    this.judgeFriend();
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