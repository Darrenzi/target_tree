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
    //评论数组
    comment:[],
    //评论输入的内容
    commentInput:"",
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

  showInputCoin: function () {
    //显示投币界面
    console.log('1')
    let target = this.data.target;
    let user = getApp().globalData.user;
    let inputCoinMsg = {};
    inputCoinMsg.targetId = target._id;
    inputCoinMsg.targetUserId = target._openid;
    inputCoinMsg.targetTitle = target.title;
    inputCoinMsg.userCoin = user.coin;
    this.setData({ inputCoinFlag: true, inputCoinMsg: inputCoinMsg });
  },

  comment:function(){
    this.setData({commentInputFlag:true});
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
    db.collection('comment').add({
      data:{
        content:content,
        target_id:that.data.target.targetId,
        time:new Date()
      }
    })
    .then(res=>{
      console.log(res);
      let comment = that.data.comment;
      comment.unshift({
        content:content,
        comment_user:[{
          avatarUrl:that.data.user.avatarUrl,
          un:that.data.user.un
        }]
      });
      this.setData({comment:comment});
      //更新评论数字段
      wx.cloud.callFunction({
        name:"changeCommentNum",
        data:{
          targetId:that.data.target.targetId
        },
        success:function(res){
          console.log(res);
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

  getComment: function(user_targets){
    let that = this;
    wx.cloud.callFunction({
      name:"getComment",
      data:{
        user_targets: user_targets
      },
      success:function(res){
        console.log(res);
        let comment = res.result.list;
        for(let i=0;i<comment.length;i++){
          comment[i].time = comment[i].time.substr(5,5);
        }
        that.setData({comment:comment});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  like: function (e) {
    //点赞
    let index = e.currentTarget.id;
    // console.log(index);
    let target = this.data.target;
    const db = wx.cloud.database();
    const _ = db.command;
    let userId = getApp().globalData.user._openid;
    //操作符，用于调用云函数
    let operation = "like";
    if (target.like.indexOf(userId) != -1) {
      console.log('取消点赞');
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
        console.log(res);
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
                console.log(res);
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
                console.log(res);
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
    if(this.data.watchFlag == "已围观")return;
    this.setData({loadContent:"正在围观..."});

    let that = this;
    wx.cloud.callFunction({
      name:"watchTarget",
      data:{
        targetId:that.data.target._id,
        watchUserId: that.data.user._openid
      },
      success:function(res){
        console.log(res);
        that.setData({watchFlag:"已围观", loadContent:"", informContent:"围观成功！赶紧去留下你的建议吧！"});
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
    console.log(options);
    options.like = options.like.split(",");
    options.supervisor = options.supervisor.split(",");
    if(options.like[0] == ""){
      options.like.pop();
    }
    if(options.supervisor[0] == "") {
      options.supervisor.pop();
    }
    this.setData({
      target:options
    });
    let user_targets = [];
    user_targets.push(options.targetId);
    this.getComment(user_targets);
    let user = getApp().globalData.user;
    this.setData({user:user});

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