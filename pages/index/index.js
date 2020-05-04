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

    //显示目标详细信息的标识符
    showTargetFlag:false,

    //用于树木显示动画的控制
    treeShow:false,
    treeHeight:0,
    treeOpacity:0,
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
    console.log('添加目标');
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

  showTargetDetail:function(){
    if(this.data.currentTarget == undefined)return;
    //点击树木显示目标详情
    if(this.data.showTargetFlag){
      this.setData({showTargetFlag:false});
    }
    else{
      this.setData({ showTargetFlag: true });
    }
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
    console.log(e);
    this.setData({currentTarget:e.detail.target, treeShow:false});
  },

  imageLoadCompleted:function(){
    console.log("图片加载完成")
    //树木图片加载完成后
    this.treeAnimation();
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
      case '时间历程':{
        wx.navigateTo({
          url: '../history/history',
          complete: function () {
            that.setData({ loadContent: '' });
          }
        })
        break;
      }
      case '社区':{
        wx.navigateTo({
          url: '../community/community',
          complete: function () {
            that.setData({ loadContent: '' });
          }
        })
        break;
      }
      case '设置':{
        wx.navigateTo({
          url: '../config/config',
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
    if(this.data.currentTarget == undefined)return;
    this.setData({loadContent:'正在记录...'});
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    let currentTarget = this.data.currentTarget;

    //判断目标是否已经失败
    let currentTimeStamp = Number(new Date());
    let startTimeStamp = Number(currentTarget.time);
    //计算目标确立时间到当前的天数
    let dayNum = ((currentTimeStamp - startTimeStamp) / 86400000).toFixed(0);
    //没有打卡的次数
    let noRecordNum = dayNum - currentTarget.record;
    if(noRecordNum > currentTarget.rest){
      //没有打卡天数大于休息的天数，认定为失败
      console.log("目标失败");
      db.collection('target').doc(currentTarget._id)
      .update({
        data:{
          status: -1
        }
      })
      .then(res=>{
        console.log(res);
        let userCoin = that.data.user.coin - currentTarget.coin;
        let user = that.data.user;
        user.coin = userCoin;
        //扣除用户押下的金币数
        db.collection('user').doc(that.data.user._id)
        .update({
          data:{
            coin:userCoin
          }
        })
        .then(res=>{
          console.log(res);

          //将目标赌金的一半平分给围观用户
          let supervisor = currentTarget.supervisor;
          let reward = currentTarget.coin/(2*supervisor.length);
          console.log(supervisor, reward);
          wx.cloud.callFunction({
            name:"rewardWatchUser",
            data:{
              supervisor:supervisor,
              reward:reward
            },
            success:function(res){
              console.log("赌金分给围观用户成功");
            },
            fail:function(err){
              console.log(err,"赌金分给围观用户失败");
            }
          })
          //调用目标组件删除完成的目标
          let targetComponent = that.selectComponent('#target');
          targetComponent.deleteTarget();

          that.setData({ user: user, loadContent:"", informContent:"目标已失败，将扣除相应金币，并种植一棵枯树"});
        })
        .catch(err=>{
          console.log(err, "\n扣除金币失败");
          that.setData({ loadContent: '', informContent: "意外错误" });
        })
      })
      .catch(err=>{
        console.log("更新目标状态失败");
        console.log(err);
        that.setData({ loadContent: '', informContent: "意外错误" });
      })
      return;
    }


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
        //取打卡表中的最后一次打卡记录，用于判断是否是同一天
        lastDate = (res.data[0].time).Format("yyyy-MM-dd");
      }
      else{
        //打卡表没有记录
        lastDate = "";
      }

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
          //更新目标表中的打卡记录及任务进度
          let progress = ((that.data.currentTarget.record + 1) / that.data.currentTarget.amount * 100).toFixed(2);
          if(progress>=100){
            //打卡后任务完成
            that.completeTarget();
          }
          else{
            //打卡后任务未完成
            that.updateTarget(progress);
          }
        }).catch(err=>{
          that.setData({loadContent:'', informContent:"意外错误"});
        })
      }
    })
  },

  updateTarget:function(newProgress){
    //打卡后任务未完成
    let currentTarget = this.data.currentTarget;
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('target').doc(currentTarget._id).update({
      data: {
        record: _.inc(1),
        progress: Number(newProgress)
      }
    }).then(res => {
      that.changeTargetTree(currentTarget, newProgress);
      //清空加载动画，设置通知内容
      that.setData({ loadContent: '', informContent: "打卡成功！坚持的人最美丽！" });
    })
    .catch(err=>{
      console.log("更新任务状态失败");
      console.log(err);
      this.setData({ loadContent: "", informContent: "意外错误" });
    })
  },

  changeTargetTree: function (currentTarget, newProgress){
    //根据任务进度更改树木图片
    let userTrees = this.data.userTrees;
    let currentTree = null;
    console.log(currentTarget.treeId, userTrees);
    for(let i =0;i<userTrees.length;i++){
      if(currentTarget.treeId == userTrees[i]._id){
        currentTree = userTrees[i];
        break;
      }
    }
    if(newProgress==30){
      //打卡后进度进入第二阶段
      currentTarget.tree = currentTree.path[1];
    }
    else if (newProgress == 60){
      //打卡后进度进入第三阶段
      currentTarget.tree = currentTree.path[2];
    }
    else if (newProgress == 90){
      //打卡后进度进入第四阶段
      currentTarget.tree = currentTree.path[3];
    }
    //更新当前页面的数据
    currentTarget.record += 1;
    currentTarget.progress = newProgress;
    this.setData({currentTarget:currentTarget});
    //更新组件中的数据
    this.selectComponent('#target').update(currentTarget);
  },

  completeTarget:function(){
    //打卡后任务完成
    let user = this.data.user;
    let currentTarget = this.data.currentTarget;
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('target').doc(currentTarget._id).update({
      data: {
        record: _.inc(1),
        progress: 100,
        status: 1
      }
    }).then(res => {
      currentTarget.record += 1;
      currentTarget.progress = 100;
      //奖励金币=10倍的天数+赌金+赞赏
      let reward = 10*currentTarget.amount + currentTarget.coin;
      console.log(reward);
      console.log(user._id);
      db.collection("user").doc(user._id)
      .update({
        data:{
          coin: _.inc(reward)
        }
      })
      .then(res=>{
        console.log(res);
        //调用目标组件删除完成的目标
        let targetComponent = that.selectComponent('#target');
        targetComponent.deleteTarget();

        // 更新数据，清空加载动画，设置通知内容
        that.setData({loadContent: '', informContent: "目标完成，获得 " + reward + " 金币"});
      })
      .catch(err=>{
        console.log("奖励金币失败");
        console.log(err);
        this.setData({loadContent:"", informContent:"意外错误"});
      })
    })
    .catch(err=>{
      console.log("更新任务状态失败");
      console.log(err);
      this.setData({ loadContent: "", informContent: "意外错误" });
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
        treeShow: true,
        treeAnimation:null
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
    //触发组件的choose方法选中第一个目标
    this.selectComponent('#target').choose({currentTarget:{id:0}});
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

