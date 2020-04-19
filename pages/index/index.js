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
    //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
    informContent:"",

    //显示选择树苗的窗口
    addTargetFlag:false,
    //用户拥有的树苗
    userTrees:[],

    //用于树木显示动画的控制
    treeShow:false,
    treeHeight:0,
    treeOpacity:0
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
        that.getUserTree();
      }
      this.setData({ loadContent: '' });
    },err=>{
      console.log("加载用户信息错误");
      this.setData({loadContent:''});
    })
  },

  addTarget:function(){
    // console.log('添加目标');
    if(this.data.addTargetFlag){
      this.setData({ addTargetFlag: false });
    }
    else{
      this.setData({ addTargetFlag: true });
    }
  },

  chooseTree:function(e){
    //创建新目标的时选中的树的id
    let treeId = e.currentTarget.dataset.treeid;
    console.log(treeId);
    this.setData({loadContent:"正在路上..."})
    let that = this;
    wx.navigateTo({
      url: '../createTarget/createTarget?treeId='+treeId,
      success:function(){
        that.setData({addTargetFlag:false, loadContent:''});
      },
      fail:function(){
        console.log(err);
      },
      complete:function(){
        that.setData({loadContent: '' });
      }
    })
  },

  getUserTree:function(){
    //获取用户所拥有的树苗
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    console.log(that.data.user.tools);
    db.collection('tool')
    .field({
      path:true
    })
    .where({
      _id:_.in(that.data.user.tools)
    }).get()
    .then(res=>{
      console.log(res);
      that.setData({userTrees: res.data});
    })
    .catch(err=>{
      console.log(err);
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
    this.setData({currentTarget:e.detail.target, treeShow:false});
    let that = this;
    //0.5s进行图片更换
    setTimeout(function(
    ){
      that.treeAnimation();
    },500)

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
        wx.navigateTo({
          url: '../forest/forest',
          complete: function () {
            that.setData({ loadContent: '' });
          }
        })
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
      case '最新消息':{
        console.log('最新消息');
        wx.navigateTo({
          url: '../messages/messages',
          complete: function () {
            that.setData({ loadContent: '' });
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
      case '目标历程':{
        wx.navigateTo({
          url: '../history/history',
          complete: function () {
            that.setData({ loadContent: '' });
          }
        })
        break;
      }
      default:{
        that.setData({ loadContent: '' });
      }
    }
  },

  record:function(){
    //打卡
    this.setData({loadContent:'正在记录...'});
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    //获取表中最新打卡记录，判断时间，一天只能打卡一次
    let date = (new Date()).Format("yyyy-MM-dd");
    db.collection('record').field({ time: true }).orderBy("time", 'desc').limit(1)
    .where({
      target_id:_.eq(that.data.currentTarget._id)
    })
    .get().then(res=>{
      console.log(res);
      let lastDate = null;
      if(res.data.length!=0){
        lastDate = (res.data[0].time).Format("yyyy-MM-dd");
      }
      else{
        lastDate = date;
      }

      // console.log(date, lastDate);
      if(lastDate == date){
        //判断时间，一天只能打卡一次
        that.setData({informContent:"您今天已经打卡,劳逸结合才能坚持到最后！", loadContent:""});
      }
      else{
        db.collection('record').add({
          //添加打卡记录
          data: {
            target_id: that.data.currentTarget._id,
            time: new Date()
          }
        }).then(res => {
          // console.log(res);
          //更新目标表中的打卡记录及任务进度
          let progress = ((that.data.currentTarget.record + 1) / that.data.currentTarget.amount * 100).toFixed(2);
          if(progress>=100){
            //打卡后任务完成
            progress=100;
            db.collection('target').doc(that.data.currentTarget._id).update({
              data: {
                record: _.inc(1),
                progress: progress,
                status:1
              }
            }).then(res => {
              // console.log(res);
              let currentTarget = that.data.currentTarget;
              currentTarget.record += 1;
              currentTarget.progress = Number((currentTarget.record / currentTarget.amount * 100).toFixed(2));
              //更新数据，清空加载动画，设置通知内容
              that.setData({ currentTarget: currentTarget, loadContent: '', informContent: "打卡成功！坚持的人最美丽！" });
              //更新组件中的数据
              that.selectComponent('#target').update(currentTarget);
            })
          }
          else{
            //打卡后任务未完成
            db.collection('target').doc(that.data.currentTarget._id).update({
              data: {
                record: _.inc(1),
                progress: progress
              }
            }).then(res => {
              // console.log(res);
              let currentTarget = that.data.currentTarget;
              currentTarget.record += 1;
              currentTarget.progress = Number((currentTarget.record / currentTarget.amount * 100).toFixed(2));;
              //更新数据，清空加载动画，设置通知内容
              that.setData({ currentTarget: currentTarget, loadContent: '', informContent: "打卡成功！坚持的人最美丽！" });
              //更新组件中的数据
              that.selectComponent('#target').update(currentTarget);
            })
          }
        }).catch(err=>{
          that.setData({loadContent:'', informContent:"意外错误"});
        })
      }
    })
  },

  treeAnimation:function(){
    //创建树木动画
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    this.animation = animation;

    animation.height("250rpx").opacity(1).step();

    this.setData({
      treeAnimation: animation.export(),
    })

    let that = this;
    setTimeout(function () {
      that.setData({
        treeHeight:0,
        treeOpacity:0,
        treeShow: true
      })
    }, 500)
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

//对Date类扩充格式化函数
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份   
    "d+": this.getDate(),                    //日   
    "h+": this.getHours(),                   //小时   
    "m+": this.getMinutes(),                 //分   
    "s+": this.getSeconds(),                 //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3),  
    "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

