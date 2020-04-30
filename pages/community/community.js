// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targets:[],
    //当前显示的内容
    currentShow:"推荐",
    //目标分页
    page:0,
    //没有更多目标的标识符，防止无效的网络拉取
    noMoreTarget:false,
    //拉到底部时显示加载文字的标识符
    loadFlag:false,
  },

  backHome: function () {
    wx.navigateBack({});
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
    console.log(index);
    let target = this.data.targets[index];
    let un = target.userList[0].un;
    let avatarUrl = target.userList[0].avatarUrl;
    let title = target.title;
    let content = target.content;
    let targetId = target._id;
    wx.navigateTo({
      url: '../targetDetail/targetDetail?un='+un+"&avatarUrl="+avatarUrl+
      "&title="+title+"&content="+content+"&targetId="+targetId,
    })
  },

  getMoreTargets:function(){
    //拉至底部时，再次拉取
    if(this.data.noMoreTarget == true)return;
    let page = this.data.page + 10;
    this.setData({page:page, loadFlag:true});
    this.getTargets(page); 
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
          that.setData({ targets: targets });
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
            target.like.push(userId);
            let targets = that.data.targets;
            targets[index] = target;
            that.setData({targets:targets});
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
            let userIndex = target.like.indexOf(userId);
            target.like.splice(userIndex, 1);
            let targets = that.data.targets;
            targets[index] = target;
            that.setData({ targets: targets });
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