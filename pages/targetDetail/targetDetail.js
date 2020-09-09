// pages/targetDetail/targetDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入聚焦的标志
    commentInputFlag:false,
    //目标的信息,包含目标用户信息
    target:{},
    //评论数
    commentNum:0,
    //评论数组
    comment:[],
    //评论输入的内容
    commentInput:"",
    //输入的类型
    commentType:"comment",
    //回复类型时，回复的评论id
    commentId:"-1",
    //选中回复的评论在评论列表中的索引
    commentIndex:-1,
    //登陆用户的信息
    user:{},
    //用户是否已经围观的标识符
    watchFlag:"围观",

    loadContent:"",
    informContent:"",
    //是否显示投币界面
    inputCoinFlag: false,
    //投币的用户及目标信息
    inputCoinMsg: {}
  },

  backHome: function () {
    wx.navigateBack({});
  },

  changeCoin: function (e) {
    //投币后修改目标的金额，并同步主页数据及社区界面数据
    let target = this.data.target;
    let insertCoin = e.detail.coin;
    target.coin += insertCoin;
    this.setData({ target: target });
    let pages = getCurrentPages();
    //获得主页
    let homePage = pages[0];
    let user = homePage.data.user;
    user.coin -= insertCoin;
    homePage.setData({ user: user });
    //获取上一个界面
    let prevPage = pages[pages.length-2];
    if (prevPage.__route__ == "pages/community/community"){
      //如果上一页为社区界面，则同步金币数
      let index = this.data.target.index;
      let prePageTarget = prevPage.data.targets[index];
      prePageTarget.coin += insertCoin;
      prevPage.setData({ [`targets[${index}]`]: prePageTarget });
    }
  },

  showInputCoin: function () {
    //显示投币界面
    let target = this.data.target;
    if (target.status != 0) {
      console.log(target);
      //任务不是正在进行中
      this.setData({ informContent: "该目标已经完成或放弃，请勿投币" });
      return;
    }
    let user = getApp().globalData.user;
    let inputCoinMsg = {};
    inputCoinMsg.targetId = target._id;
    inputCoinMsg.targetUserId = target._openid;
    inputCoinMsg.targetTitle = target.title;
    inputCoinMsg.userCoin = user.coin;
    this.setData({ inputCoinFlag: true, inputCoinMsg: inputCoinMsg });
  },

  comment:function(e){
    let commentType = e.currentTarget.dataset.type;
    let commentId = e.currentTarget.dataset.commentid;
    let commentIndex = e.currentTarget.id;
 
    this.setData({commentInputFlag:true, commentType:commentType, commentId, commentId, commentIndex:commentIndex});
  },

  hideCommentInput:function(){
    //隐藏输入框
    this.setData({ commentInputFlag: false, commentInput:""});
  },

  goToUserForest: function () {
    //跳转到用户森林
    let target = this.data.target;
    let un = target.un;
    let avatarUrl = target.avatarUrl;
    let userId = target._openid;
    wx.navigateTo({
      url: '../friendDetail/friendDetail?un=' + un + "&avatarUrl=" + avatarUrl + "&userId=" + userId
    })
  },

  sendComment:function(e){
    //发送评论
    let content = e.detail.value;
    if(content == "")return;
    const db = wx.cloud.database();
    let that = this;
    let commentType = this.data.commentType;
    let commentId = "";
    if(commentType == "reply"){
      commentId = this.data.commentId;
    }
    db.collection('comment').add({
      data:{
        content:content,
        target_id:that.data.target.targetId,
        time:new Date(),
        comment_id:commentId,
        type:commentType
      }
    })
    .then(res=>{

      let comment = that.data.comment;
      if(commentType == "comment"){
        //更新评论数据
        comment.unshift({
          _id: res._id,
          content: content,
          comment_user: [{
            avatarUrl: that.data.user.avatarUrl,
            un: that.data.user.un,
            _openid: that.data.user._openid
          }],
          replyMsg:[]
        });
      }
      else{
        //更新评论回复数据
        let index = that.data.commentIndex;
        comment[index].replyMsg.unshift({
          _id: res._id,
          content: content,
          comment_user: [{
            avatarUrl: that.data.user.avatarUrl,
            un: that.data.user.un,
            _openid: that.data.user._openid
          }],
          replyMsg: []
        })
      }
      this.setData({comment:comment});

      //更新评论数字段
      wx.cloud.callFunction({
        name:"changeCommentNum",
        data:{
          targetId:that.data.target.targetId
        },
        success:function(res){
    
        },
        fail:function(err){
          console.log(err);
        }
      })
    })
    .catch(err=>{
      console.log(err);
    })

  },

  getComment: function (targetId){
    let that = this;
    wx.cloud.callFunction({
      name:"getCommentByTargetId",
      data:{
        targetId: targetId
      }
    })
    .then(res=>{

      let allComment = res.result.list;
      let reply = [];
      let comment = [];
      //处理评论和回复
      for (let i = 0; i < allComment.length; i++) {
        allComment[i].time = allComment[i].time.substr(5, 5);
        allComment[i].replyMsg = [];
        switch(allComment[i].type){
          case "reply":{
            reply.push(allComment[i]);
            break;
          }
          case "comment":{
            comment.push(allComment[i]);
            break;
          }
        }
      }
      for(let i=0;i<reply.length;i++){
        for(let j=0;j<comment.length;j++){
          if(reply[i].comment_id == comment[j]._id){
            //判断该条回复是否属于该评论
            comment[j].replyMsg.push(reply[i]);
            break;
          }
        }
      }
    
      that.setData({ comment: comment, commentNum:allComment.length });
    })
    .catch(err=>{
      console.log(err);
    })
  },

  like: function (e) {
    //点赞
    let index = e.currentTarget.id;
   
    let target = this.data.target;
    const db = wx.cloud.database();
    const _ = db.command;
    let userId = getApp().globalData.user._openid;
    //操作符，用于调用云函数
    let operation = "like";
    if (target.like.indexOf(userId) != -1) {
  
      operation = 'cancel';
    }
    switch(operation){
      case "like":{
        target.like.push(userId);
        this.setData({ target: target });
        break;
      }
      case "cancel":{
        let userIndex = target.like.indexOf(userId);
        target.like.splice(userIndex, 1);
        this.setData({ target: target });
        break;
      }
    }

    let that = this;
    wx.cloud.callFunction({
      name: "changeLike",
      data: {
        targetId: target._id,
        userId: userId,
        operation: operation
      },
      success: function (res) {
      
        //删除修改数组
        switch (operation) {
          case 'like': {
            //插入点赞表
            db.collection('like').add({
              data: {
                time: new Date(),
                target_id: target._id
              }
            })
              .then(res => {
               ;
              })
              .catch(err => {
                console.log(err);
              })
            break;
          }
          case 'cancel': {
            // 删除点赞表记录
            wx.cloud.callFunction({
              name: "cancelLike",
              data: {
                userId: userId,
                targetId: target._id
              }
            })
              .then(res => {
            
              })
              .catch(err => {
                console.log(err);
              })
            break;
          }
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  watch:function(){
    //围观
    let watchFlag = this.data.watchFlag;
    //云函数操作参数，用于围观或取消围观的控制
    let option = "watch";
    let loadContent = "正在修改...";
    let informContent = "围观成功！赶紧去留下你的建议吧！";
    if(watchFlag == "已围观"){
      option = "cancelWatch";
      watchFlag = "围观";
      loadContent = "正在取消围观...";
      informContent = "取消围观成功";
    }
    else{
      watchFlag = "已围观";
    }
    this.setData({ loadContent: loadContent });

    let that = this;
    wx.cloud.callFunction({
      name:"watchTarget",
      data:{
        targetId:that.data.target._id,
        watchUserId: that.data.user._openid,
        option:option
      },
      success:function(res){
       
        
        that.setData({watchFlag:watchFlag, loadContent:"", informContent:informContent});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    options.coin = Number(options.coin);
    options.status = Number(options.status);
    options.like = options.like.split(",");
    options.supervisor = options.supervisor.split(",");
    if(options.like[0] == ""){
      options.like.pop();
    }
    if(options.supervisor[0] == "") {
      options.supervisor.pop();
    }

    this.getComment(options.targetId);
    let user = getApp().globalData.user;
    this.setData({ user: user, target: options});

    if (options.supervisor.indexOf(user._openid) != -1){
      //判断用户是否已经围观该目标
      this.setData({watchFlag:"已围观"});
    }
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