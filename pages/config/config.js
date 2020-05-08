// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    content:'',//用户自己的评论
    myself:'',//用户OPENid
    nowdate:'',
    //加载表示符，用于控制加载动画,当值为 "" 隐藏
    loadContent: "加载中...",
    //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
    informContent:"",
    input:'',
    changeTheme:true,//控制改变主题窗口
    changeView:true,
    changeView_1:true,
    Towhere:-1, //为0时跳转到白色界面，为1时跳转到绿色界面
  },
  backHome: function () {
   wx.navigateBack({
 
    })
  },

  changeview:function(){  //点击白色
    this.setData({
     changeView:false,
     changeView_1:true,
     Towhere:0
    })
     try{wx.setStorage({
       data: 'white',
       key: 'theme',
       success: function(res) {
        console.log(res)
      }
     })
    }
    catch (e) {
      console.log("err",e)
     }
  },
  changview_1:function(){  //点击绿色
    this.setData({
      changeView_1:false,
      changeView:true,
      Towhere:1
     })
      try{wx.setStorage({
       data: 'green',
       key: 'theme',
       success: function(res) {
        console.log(res)
      }
     })
    }
    catch (e) {
      console.log("err",e)
     }
  },
  TochooseTheme:function(){
    //根据主题跳转
    wx.redirectTo({
      url: '../loading/loading',
    })


  },
  getInputTarget:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  getidea:function(){
    this.setData({
      hidden:false
    })
  },
  return:function(){
    this.setData({
      hidden:true,
      content:'',
      input:''
    })
  },
  return_1:function(){
    this.setData({
      changeTheme:true
    })
  },
  submit:function(){
    let date=new Date()
    this.setData({
      nowdate:date
    })
    if(this.data.content==''){
      this.setData({
        informContent:"请输入有效意见~"
      })
      return
    }
    console.log(date)
    let app=getApp()
    let userOpenid=app.globalData.user._openid
    this.setData({
      myself:userOpenid
    })
   
    console.log(this.data.myself)
    let content=this.data.content
    console.log(content)
    let time=this.data.nowdate
 
    const db=wx.cloud.database()
    db.collection('suggestion')
    .add({
      data: {
        //提交问题的用户
        content:content,
        //提交时间
        time:time
      },
    })
    .then(res=>{
      console.log("res",res)
      this.setData({
        hidden:true,
        informContent:'您的意见已提交',
        input:''
      })
    })
    
  },
  chooseTheme:function(){
    
    this.setData({
      changeTheme:false,
      changeView:true,
      changeView_1:true

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loadContent:'',
      
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

  }
})