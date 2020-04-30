
Page({

  /**
   * 页面的初始数据
   */
  data: {
     a:'<',
     change_1:true,
     change_2:false,
     change_3:true,
     temp:[],
     navList:[],//好友列表
     userList:[], //用于存放除了用户及其好友的数组
     sortfriend:[],//用于存放好友排名中从数据库拉下来的数据的数组
     myrank:[],
     loadContent:'',
     informContent:'',
     date:'4月30日'
  },
  backHome: function () {
   wx.navigateTo({
     url: '../index/index',
   })
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
  init:function(){
   this.setData({
     loadContent:'加载好友中...'
   })
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('friend')
    .get()
    .then(res=>{
      console.log("res",res.data)
      this.setData({
        temp:res.data
      })
      console.log("temp",this.data.temp)
    //   let length=this.data.temp.length
    //   for(let i=0;i<length;i++){
    //     db.collection('user')
    //     .where({
    //       _openid:_.eq(this.data.temp[i].sender)
    //     })
    //     .get()
    //     .then(res=>{
    //       console.log("friend",res.data[0])
    //       this.data.navList.push(res.data[0]),
    //       this.setData({
    //       navList:this.data.navList
    //     })
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    //   }
    //   this.setData({
    //     loadContent:''
    //   })
     })
    .catch(err => {
      console.log(err);
    })
 
  },
  //排名，获取每天好友创建目标的数量，从而根据数量来进行自己的排名

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
    //this.init()

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