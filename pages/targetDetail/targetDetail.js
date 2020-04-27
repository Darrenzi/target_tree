// pages/targetDetail/targetDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入聚焦的标志
    commentInputFlag:false,
    //目标的信息
    target:{},
    //评论数组
    comment:[],
    //评论输入的内容
    commentInput:"",
    //用户的信息
    user:{}
  },

  backHome: function () {
    wx.navigateBack({});
  },

  comment:function(){
    this.setData({commentInputFlag:true});
  },

  hideCommentInput:function(){
    //隐藏输入框
    this.setData({ commentInputFlag: false, commentInput:""});
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      target:options
    });
    let user_targets = [];
    user_targets.push(options.targetId);
    this.getComment(user_targets);
    let user = getApp().globalData.user;
    this.setData({user:user});
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