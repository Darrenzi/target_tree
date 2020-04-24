
Page({

  /**
   * 页面的初始数据
   */
  data: {
     a:'<',
     change_1:false,
     change_2:true,
     change_3:true,
     navList:[],
     userList:[],
     sortfriend:[],
    
  },
  backHome: function () {
    wx.navigateBack({});
  },

  backHome: function () {
    wx.navigateBack({});
  },

  
  ChangeShowStatus:function(){
    var that = this
    that.setData({
      change_1:false,
      change_2: true,
      change_3:true
    })
  },

  ChangeShowStatus_2: function () {
    var that = this
    that.setData({
      change_1: true,
      change_2:false,
      change_3: true
    })
  },
  ChangeShowStatus_3: function () {
    var that = this
    that.setData({
      change_1: true,
      change_2: true,
      change_3: false
    })
  },

  backhome:function(){
    wx.navigateBack({});
  },

  getFriendDetail:function(e){
    //跳转到好友详情界面
    //好友信息在列表中的索引值
    let index = e.currentTarget.id;
    let user = this.data.navList[index].friendList[0];
    // console.log(user.un, user.avatarUrl, user._openid);
    wx.navigateTo({
      url: '../friendDetail/friendDetail?un='+user.un+"&avatarUrl="+user.avatarUrl+"&userId="+user._openid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'friend',})
      .then(res=>{
        console.log(res)
        this.setData({
          navList:res.result.list,
        })
        console.log(this.data.navList)
      })
    wx.cloud.callFunction({
      name:'stranger',
    }).then(res=>{
      console.log(res)
      this.setData({
        userList:res.result.data
      })
    })

    wx.cloud.callFunction({
      name:'sort',
    }).then(res=>{
      console.log(res)
      this.setData({
        sortfriend:res.result.data
      })
    })
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

  },

  
})