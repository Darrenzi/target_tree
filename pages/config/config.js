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
    //当前主题
    changeView:"",
    Towhere:-1, //为0时跳转到白色界面，为1时跳转到绿色界面
    showIdea:true,
    problem:[  {title:"闪退/卡顿",
    specific:"页面闪退或卡顿"},
    {title:"目标发布",
    specific:"发布失败，内容丢失"},
    {title:"商城/支付",
    specific:"商品加载，支付失败"},
    {title:"进度/时间",
    specific:"无法刷新，不显示"},
    {title:"围观/投币",
    specific:"无法围观，无法投币"},
    {title:"私信/评论",
    specific:"关注，发送接受私信"},
    {title:"个人中心",
    specific:"账号注销，资料不显示"},
    {title:"其他",
    specific:"点赞，历史进程"},
  ],
    title:'',//存放点击的错误的标题
    inputProblem:true,
    problemContent:''
  },
  backHome: function () {
   wx.navigateBack({
 
    })
  },

  toBeAdd:function(){
    this.setData({informContent:"该模块正在完善"});
  },

  choose:function(e){
    let index = e.currentTarget.id;
    console.log(index)
    this.setData({
        title:this.data.problem[index].title,
        inputProblem:false
      })
  },
  problem_back:function(){
   this.setData({
     showIdea:true
   })
  },
  getInputProblem:function(e){
    this.setData({
      problemContent: e.detail.value
    })
  },
  problem_return:function(){
     this.setData({
       inputProblem:true,
       input:''
     })
  },
  problem_submit:function(){
    let date=new Date()
    this.setData({
      nowdate:date
    })
    if(this.data.problemContent==''){
      this.setData({
        informContent:"请输入有效意见~"
      })
      return
    }
      const db=wx.cloud.database()
      let title=this.data.title
      let problemContent=this.data.problemContent
      db.collection('suggestion')
      .add({
         data: {
      content:problemContent,
      category:title,
      time:this.data.nowdate}
        })
        .then(res=>{
             console.log("提交成功",res)
             this.setData({
             informContent:'已经提交',
             inputProblem:true,
         })
     })
  },
  changeview:function(e){  //点击白色
    let theme = e.currentTarget.dataset.theme;
    console.log(theme);
    this.setData({ changeView:theme});
  },
  showIdea:function(){
    this.setData({
      showIdea:false
    })
  },
  toChooseTheme:function(){
    //根据主题跳转
    let url = "";
    let theme = this.data.changeView;
    try{
      wx.setStorageSync("theme", theme);
      switch (theme) {
        case "white": {
          url = "../home/home";
          break;
        }
        case "green": {
          url = "../index/index";
          break;
        }
      }
      wx.reLaunch({
        url: url
      })
    }catch(err){
      this.setData({informContent:"意外错误"});
      console.log(err);
    }
  },
  getInputTarget:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  getidea:function(){
    this.setData({
      hidden:true
    })
  },
  return1:function(){
    this.setData({
      hidden:false,
      content:'',
      input:''
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
        hidden:false,
        informContent:'您的意见已提交',
        input:''
      })
    })
    
  },
  
  chooseTheme:function(){
    if (this.data.changeTheme){
      this.setData({
        changeTheme: false,
      })
    }
    else{
      this.setData({
        changeTheme: true,
      })
    }
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