// pages/messages/messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户所有目标的id
    user_targets:[],
    //评论列表
    comments:[],
    //点赞列表
    like:[],
    //好友申请列表
    newFriend:[],
    //系统提醒列表
    tip:[],
    //当前展示的内容,like:点赞， comment:评论, newFriend:新朋友, tip:提醒
    current_show:"like",
    //当前选中的数据在其对应的数组的索引值
    current_index:-1,
    //新的评论数
    newCommentNum:0,
    //新的点赞数
    newLikeNum:0,
    //新的朋友数
    newFriendNum:0,
    //新的系统提示
    newTipNum:0,

    loadContent:"",
    user:getApp().globalData.user
  },

  backHome: function () {
    wx.navigateBack({});
  },

  operateMessage:function(e){
    //控制删除按钮的显示

    //数据在数组中的索引
    let index = e.currentTarget.id;

    if(this.data.current_index != -1){
      this.setData({ current_index: -1 });
    }
    else{
      this.setData({ current_index: Number(index) });
    }
  },

  replyMsg:function(){
    //回复消息
    this.setData({loadContent:"正在路上..."});
    let index = this.data.current_index;
    let id = this.data.comments[index].target_id;

    wx.cloud.callFunction({
      name:"getTargetById",
      data:{
        targetId: id
      }
    })
    .then(res=>{
  
      let target = res.result.list[0];
      let un = target.userList[0].un;
      let avatarUrl = target.userList[0].avatarUrl;
      let _openid = target.userList[0]._openid;
      let title = target.title;
      let content = target.content;
      let targetId = target._id;
      let like = target.like.toString();
      let _id = target._id;
      let supervisor = target.supervisor.toString();
      let progress = target.progress;
      let coin = target.coin;
      let status = target.status;
      wx.navigateTo({
        // index为目标在数组中的索引，用于界面修改数据
        url: '../targetDetail/targetDetail?un=' + un + "&avatarUrl=" + avatarUrl + "&_openid=" + _openid +
          "&title=" + title + "&content=" + content + "&targetId=" + targetId + "&like=" + like + "&_id=" + _id
          + "&supervisor=" + supervisor + "&progress=" + progress + "&coin=" + coin + "&index=" + index+"&status="+status,
      })
      this.setData({current_index:-1, loadContent:""});
    })
    .catch(err=>{
      console.log(err);
    })
  },

  deleteMsg:function(e){
    //删除某条消息
    let index = this.data.current_index;
    if(this.data.current_show == "tip"){
      index = e.currentTarget.id;
    }
    let currentData = [];
    let that = this;
    let id = "";//记录的id
    switch(this.data.current_show){
      case 'comment':{
        currentData = this.data.comments;
        id = currentData[index]._id;
        let comments = this.data.comments;
        comments.splice(index, 1);
        this.setData({ comments: comments, current_index: -1});
        break;
      }
      case 'like':{
        currentData = this.data.like;
        id = currentData[index]._id;
        let like = this.data.like;
        like.splice(index, 1);
        this.setData({ like: like, current_index:-1});
        break;
      }
      case 'tip': {
        currentData = this.data.tip;
        id = currentData[index]._id;
        let tip = this.data.tip;
        tip.splice(index, 1);
        this.setData({ tip: tip, current_index:-1});
        break;
      }
    }
    this.setData({ current_index: -1 });
    wx.cloud.callFunction({
      name:"deleteMsg",
      data:{
        tableName:that.data.current_show,
        id:id
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  init:function(){
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    let user = getApp().globalData.user;
    db.collection('target').field({_id:true}).get().then(res=>{

      //用户所有的任务id
      let user_targets = [];
      for(let i=0;i<res.data.length;i++){
        user_targets.push(res.data[i]._id);
      }
 
      
      //获取评论
      wx.cloud.callFunction({
        name:'getComment',
        data:{
          user_targets:user_targets
        },
        success:function(res){
    
          let data = res.result.list;
          let newCommentNum = 0;
          for(let i=0;i<data.length;i++){
            let timeStamp = Number(new Date(data[i].time));
            data[i].time = data[i].time.substr(5, 5);
            data[i].timeStamp = timeStamp;
            if (timeStamp > that.data.lastDate.commentTimeStamp) {
              newCommentNum += 1;
            }
          }
          that.setData({comments:data, newCommentNum:newCommentNum});
        },
        fail:function(err){
          console.log(err);
        }
      })

      //获取点赞
      wx.cloud.callFunction({
        name:"getLike",
        data:{
          user_targets: user_targets
        },
        success:function(res){
          let data = res.result.list;
      
          //获取日期
          let newLikeNum = 0;//新的点赞信息数
          for(let i = 0; i < data.length; i++) {
            let timeStamp = Number(new Date(data[i].time));
            data[i].time = data[i].time.substr(5, 5);
            data[i].timeStamp = timeStamp;
            if(timeStamp > that.data.lastDate.likeTimeStamp){
              newLikeNum += 1;
            }
          }
          that.setData({ like: data, newLikeNum:newLikeNum});
        },
        fail:function(err){
          console.log(err);
        }
      })

      //获取好友申请
      wx.cloud.callFunction({
        name:"getFriendRequest",
        data:{
          receiver:user._openid
        },
        success:function(res){
     
          let data = res.result.list;
          let newFriendNum = 0;
          for (let i = 0; i < data.length; i++) {
            let timeStamp = Number(new Date(data[i].time));
            data[i].time = data[i].time.substr(5, 5);
            data[i].timeStamp = timeStamp;
            if (timeStamp > that.data.lastDate.newFriendTimeStamp) {
              newFriendNum += 1;
            }
          }
          that.setData({ newFriend: data, newFriendNum: newFriendNum });
        },
        fail:function(err){
          console.log(err)
        }
      })

      //获取系统提醒
      db.collection('tip')
      .where({
        receiver: _.eq(user._openid)
      })
      .orderBy("time", "desc")
      .get()
      .then(res=>{
      
        let data = res.data;
        let newTipNum = 0;
        for (let i = 0; i < data.length; i++) {
          let timeStamp = Number(data[i].time);
          data[i].timeStamp = timeStamp;
          if (timeStamp > that.data.lastDate.tipTimeStamp) {
            newTipNum += 1;
          }
        }
        that.setData({ tip:data, newTipNum: newTipNum });
      })
      .catch(err=>{
        console.log(err);
      })
    })
  },

  choose:function(e){
    // 选择显示点赞，评论，新盆友，提醒
    let target = e.currentTarget.dataset.target;
    this.setData({ current_show: target, current_index:-1});
    //清空新消息的提示
    switch(target){
      case 'comment':{
        if(this.data.newCommentNum !=0){
          this.setData({newCommentNum:0});
        }
        break;
      }
      case 'like': {
        if (this.data.newLikeNum != 0) {
          this.setData({ newLikeNum: 0 });
        }
        break;
      }
      case 'newFriend':{
        if (this.data.newFriendNum != 0) {
          this.setData({ newFriendNum: 0 });
        }
        break;
      }
      case 'tip':{
        if (this.data.newTipNum != 0) {
          this.setData({ newTipNum: 0 });
        }
        break;
      }
    }
  },

  addFriend:async function(e){
    //同意添加好友
    let index = e.currentTarget.id;
    let status = this.data.newFriend[index].status;
    if(status != 0)return;

    //修改数组中的数据
    let newFriend = this.data.newFriend;
    newFriend[index].status = 1;
    this.setData({newFriend:newFriend});

    let sender = this.data.newFriend[index]._openid;
    let recordId = this.data.newFriend[index]._id;
    let userId = getApp().globalData.user._openid;
   
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('friend').where(_.or([
      {
        _openid:_.eq(userId),
        sender:_.eq(sender)
      },
      {
        _openid:_.eq(sender),
        sender:_.eq(userId)
      }
    ]))
    .get()
    .then(res=>{
      if(res.data.length != 0 ){
        //列表不为0，说明两人已互为好友
        return;
      }
      else{
        //暂不为好友，加入好友表
        db.collection('friend').add({
          data: {
            sender: sender
          }
        })
        .then(res => {
          //更新好友申请的状态
          wx.cloud.callFunction({
            name: "friendRequestStatus",
            data: {
              id: recordId,
              status: 1
            },
            fail: function (err) {
              console.log(err);
            }
          })
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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
    try {
      //获取存储在本地的最后拉取消息的时间戳
      let lastDateString = wx.getStorageSync('lastDate');

      if (lastDateString != "") {
        //本地有记录
        let lastDate = JSON.parse(lastDateString);
     
        this.setData({lastDate:lastDate});
      }
      else{
         //本地无记录
        let lastDate = {
          likeTimeStamp:0,
          commentTimeStamp:0,
          newFriendTimeStamp:0,
          tipTimeStamp:0
        };
        this.setData({ lastDate: lastDate });
      }
    } catch (e) {
      let lastDate = {
        likeTimeStamp: 0,
        commentTimeStamp: 0,
        newFriendTimeStamp: 0,
        tipTimeStamp: 0
      };
      this.setData({ lastDate: lastDate });
    }
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
    //储存最后拉取消息的时间
    let likeTimeStamp = 0;
    if(this.data.like.length>0){
     likeTimeStamp = this.data.like[0].timeStamp;
    }
    let commentTimeStamp = 0;
    if (this.data.comments.length > 0) {
      commentTimeStamp = this.data.comments[0].timeStamp;
    }
    let newFriendTimeStamp = 0
    if (this.data.newFriend.length > 0) {
      newFriendTimeStamp = this.data.newFriend[0].timeStamp;
    }
    let tipTimeStamp = 0
    if (this.data.tip.length > 0) {
      tipTimeStamp = this.data.tip[0].timeStamp;
    }
    let lastDate = {
      likeTimeStamp: likeTimeStamp,
      commentTimeStamp:commentTimeStamp,
      newFriendTimeStamp: newFriendTimeStamp,
      tipTimeStamp: tipTimeStamp
    };
    let lastDateString = JSON.stringify(lastDate);
    wx.setStorage({
      key: 'lastDate',
      data: lastDateString,
    });
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
