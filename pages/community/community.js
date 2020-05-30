// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //登陆的用户
    user:{},
    targets:[],
    //当前显示的内容
    currentShow:"推荐",
    //目标分页
    page:0,

    //围观的目标
    watchTargets:[],
    //没有更多目标的标识符，防止无效的网络拉取
    noMoreTarget:false,
    //拉到底部时显示加载文字的标识符
    loadFlag:false,
    //是否显示投币界面
    inputCoinFlag:false,
    inputCoinIndex:-1,
    //投币的用户及目标信息
    inputCoinMsg:{},
    loadContent:"加载中...",
    informContent:""
  },

  backHome: function () {
    wx.navigateBack({});
  },
  
  choose:function(e){
    //选择显示的目标，围观或者推荐
    let targetShow = e.currentTarget.dataset.target;
    this.setData({currentShow: targetShow});
  },

  changeCoin: function (e) {
    //投币后修改目标的金额，并同步主页数据
    let target = this.data.targets[this.data.inputCoinIndex];
    let insertCoin = e.detail.coin;
    target.coin += insertCoin;
    this.setData({ [`targets[${this.data.inputCoinIndex}]`]: target });
    let pages = getCurrentPages();
    //获得主页
    let prevPage = pages[pages.length - 2];
    let user = prevPage.data.user;
    user.coin -= insertCoin;
    prevPage.setData({user:user});
  },

  showInputCoin:function(e){
    //显示投币界面
    let index = e.currentTarget.id;
    let target = this.data.targets[index];
    if(target.status != 0){
      //任务不是正在进行中
      this.setData({informContent:"该目标已经完成或放弃，请勿投币"});
      return;
    }
    let user = getApp().globalData.user;
    let inputCoinMsg = {};
    inputCoinMsg.targetId = target._id;
    inputCoinMsg.targetUserId = target._openid;
    inputCoinMsg.targetTitle = target.title;
    inputCoinMsg.userCoin = user.coin;
    this.setData({ inputCoinFlag: true, inputCoinMsg: inputCoinMsg, inputCoinIndex:index});
  },

  goToUserForest:function(e){
    let index = e.currentTarget.id;
    let target = this.data.targets[index];
    let un = target.userList[0].un;
    let avatarUrl = target.userList[0].avatarUrl;
    let userId = target._openid;
    wx.navigateTo({
      url: '../friendDetail/friendDetail?un=' + un + "&avatarUrl=" + avatarUrl + "&userId=" + userId
    })
  },

  targetDetail:function(e){
    let index = e.currentTarget.id;
    // console.log(index);
    let targets = this.data.targets;
    if(this.data.currentShow == "围观"){
      targets = this.data.watchTargets;
    }
    let target = targets[index];
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
      url: '../targetDetail/targetDetail?un='+un+"&avatarUrl="+avatarUrl+"&_openid="+_openid+
      "&title="+title+"&content="+content+"&targetId="+targetId+"&like="+like+"&_id="+_id
        + "&supervisor=" + supervisor + "&progress=" + progress+"&coin="+coin+"&index="+index+"&status="+status,
    })
  },

  getMoreTargets:function(){
    //拉至底部时，再次拉取
    console.log("加载更多");
    if(this.data.noMoreTarget == true)return;
    let page = this.data.page + 10;
    this.setData({page:page, loadFlag:true});
    this.getTargets(page); 
  },

  getWatchTargets:function(){
    let that = this;
    wx.cloud.callFunction({
      name:"getWatchTargets",
      success:function(res){
        that.setData({watchTargets:res.result.list});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  getTargets:function(page){
    //根据page，进行分页获取目标,一次获取10条目标
    let that = this;
    wx.cloud.callFunction({
      name: "getAllTargets",
      data: {
        page: page
      },
      success: function (res) {
        console.log("alltargets",res);
        if(res.result.list.length != 0)
        {
          let targets = that.data.targets;
          targets = targets.concat(res.result.list);
          // console.log(targets);
          that.setData({ targets: targets, loadContent:"" });
        }
        else{
          //没有更多内容
          that.setData({noMoreTarget:true});
        }
        //隐藏加载文字
        that.setData({loadFlag:false});
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  like:function(e){
    //点赞
    let index = e.currentTarget.id;
    // console.log(index);
    let target =  this.data.targets[index];
    const db = wx.cloud.database();
    const _ = db.command;
    let userId = getApp().globalData.user._openid;
    //操作符，用于调用云函数
    let operation = "like";
    if(target.like.indexOf(userId) != -1){
      console.log('取消点赞');
      operation = 'cancel';
    }
    switch (operation) {
      case "like": {
        target.like.push(userId);
        let targets = this.data.targets;
        targets[index] = target;
        this.setData({ targets: targets });
        break;
      }
      case "cancel": {
        let userIndex = target.like.indexOf(userId);
        target.like.splice(userIndex, 1);
        let targets = this.data.targets;
        targets[index] = target;
        this.setData({ targets: targets });
        break;
      }
    }
    let that = this;
    wx.cloud.callFunction({
      name:"changeLike",
      data:{
        targetId: target._id,
        userId:userId,
        operation: operation
      },
      success:function(res){
        console.log(res);
        //删除修改数组
        switch(operation){
          case 'like':{
            //插入点赞表
            db.collection('like').add({
              data:{
                time:new Date(),
                target_id:target._id
              }
            })
            .then(res=>{
              console.log(res);
            })
            .catch(err=>{
              console.log(err);
            })
            break;
          }
          case 'cancel':{
            // 删除点赞表记录
            wx.cloud.callFunction({
              name:"cancelLike",
              data:{
                userId:userId,
                targetId:target._id
              }
            })
            .then(res=>{
              console.log(res);
            })
            .catch(err=>{
              console.log(err);
            })
            break;
          }
        }
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
    this.getTargets(0);
    this.getWatchTargets();
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