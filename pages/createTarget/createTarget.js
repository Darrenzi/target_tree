// pages/createTarget/createTarget.js
var util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numbers:[50,100,200,600,800,1000],
    change:false,
    change_1:true,
    change_2:true,
    custom:true,
    showtitle:true,
    showCircle:true,
    showCircle_1:true,showCircle_2:true,showCircle_3:true,showCircle_4:true,
    showCircle_5:true,showCircle_6:true,showCircle_7:true,showCircle_8:true,
    showCircle_9:true,showCircle_10:true,showCircle_11:true,showCircle_12:true,
    showCircle_13:true,showCircle_14:true,showCircle_15:true,
    label:'',

    //权限控制
    rightControls: ['全部人可见', '好友可见', '仅自己可见'],
    rightControl:"全部人可见",
    setCoin:0,
    rest:0,
    record:'',
    content:'',
    date:'',
    title:'',
    changeView:false,
    changeView_1:false,
    amount:0,
    setDate:0,
    //树苗的Id
    treeId:"",
    //加载表示符，用于控制加载动画,当值为 "" 隐藏
    loadContent: "加载中...",
    //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
    informContent:""
  },

  rightControl:function(e){
    //权限控制
    let index = e.detail.value;
    let rightControl = this.data.rightControls[index];
    this.setData({rightControl:rightControl});
  },

  bindDateChange:function(e){  //获取多行滑动组件中的值
    this.setData({
      date: e.detail.value
    })
  },
  backToindex:function(){
    wx.navigateBack({
    
    })
  },

  changeview:function(){  //点击今天
    this.setData({
     changeView:false,
     changeView_1:false,
     setDate:0
    })
  },
  changview_1:function(){  //点击明天的函数
    this.setData({
      changeView_1:true,
      changeView:true,
      setDate:1
     })
  },
  //按键输入至input框中
  setdata:function(e){
    this.setData({
      number:'50',
      setCoin:'50'
    })
  },
  setCoinNumber:function(e){   
    this.setData({
      number:'100',
      setCoin:'100'
    })
  },
  setdata_2:function(e){
    this.setData({
      number:'150',
      setCoin:'150'
    })
  },
  setdata_3:function(e){
    this.setData({
      number:'200',
      setCoin:'200'
    })
  },
  setdata_4:function(e){
    this.setData({
      number:'300',
      setCoin:'300'
    })
  },
  setdata_5:function(e){
  
    this.setData({
      number:'500',
      setCoin:'500'
    })
  },
  
  
  setrecord:function(e){
    this.setData({
      record:'7'
    })
  },
  setrecord_1:function(e){
    this.setData({
      record:'10'
    })
  },
  setrecord_2:function(e){
    this.setData({
      record:'15'
    })
  },
  setrecord_3:function(e){
    this.setData({
      record:'21'
    })
  },

  getRest:function(e){
  this.setData({
  rest:e.detail.value
})
  },

  back:function(){
    wx.navigateBack({});
  },
  backToCoin:function(){
     this.setData({
      change:true,
      change_1:true,
     })
  },
  changeShowstatus:function(){   //
    let app=getApp()
    let userCoin=app.globalData.user.coin
    console.log("userCoin",userCoin)
    console.log("setCOin",this.data.setCoin)
    if (userCoin < this.data.setCoin && this.data.setCoin!=0){
      this.setData({
       informContent:"诶呀，你的金币不够呢",
     })
     return
   }
   console.log("test")
    if(this.data.setCoin<0){
      this.setData({informContent:"请输入正确的数额"});
      return
     }
    
     this.setData({
      change:(!this.data.change),
      change_1:(!this.data.change_1),
     })
  },

  changeShowstatus_1:function(){
    var nowdate = util.formatTime(new Date())
    this.setData({
      date:nowdate
    })
    var label=this.data.label
    if(label==""){
      var that=this
      that.setData({informContent:"请输入正确的标签"});
      return
     }
    this.setData({
     change:false,
     change_1:true,
     change_2:true,
     showtitle:false,
     custom:true
    })
 },
  changeShowStatus_2:function(){
    this.setData({
      change:false,
      change_1:true,
      showtitle:false,
      change_2:true,
      custom:true
    })
  },
  changeShowstatus_4:function(){

    this.setData({
      change:false,
      change_1:false,
      change_2:true,
      custom:true,
      showtitle:true
    })
  },
  changeShowstatus_3:function(){
   
    var content=this.data.content
    if(content==""){
     var that=this
     that.setData({informContent:"请输入目标内容"});
     return
    }
    var title=this.data.title
    if(title==""){
     var that=this
     that.setData({informContent:"请输入目标标题"});
     return
    }
    var content=this.data.content
    if(content==""){
     var that=this
     that.setData({informContent:"请输入目标内容"});
     return
    }
    var title=this.data.title
    if(title==""){
     var that=this
     that.setData({informContent:"请输入目标标题"});
     return
    }
    this.setData({
      change:false,
      change_1:true,
      change_2:false,
      custom:true,
      showtitle:true
    })
  },
  Tocustom:function(){
    this.setData({
      change:false,
      change_1:true,
      change_2:true,
      custom:false
    })
  },
  backTohot:function(){
    this.setData({
      change:false,
      change_1:false,
      change_2:true,
      custom:true
    })
  },
  choose:function(e){
    let index = e.currentTarget.id;
    console.log("index",index)
    this.setData({
      current_index:index,
      label:this.data.labelList[index].label
    });
  },
  getInputCoin:function(e){
      this.setData({
        setCoin: e.detail.value
      })
  },
  getInput:function(e){
      this.setData({
        content: e.detail.value
      })
  },
  getInputtitle:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  getInputContent:function(e){
   this.setData({
    content:e.detail.value
   })
  },

 end:function(e){
   //显示加载动画
   this.setData({
     loadContent:"创建中...",
     informContent:''
    });

   let setDate=this.data.setDate
   let date=this.data.date
   if(setDate==1){  //选择明天开始目标
    var TIME = util.formatTime(new Date());
    var startTime=TIME;
    var endTime=date;
    console.log("结束时间：",endTime)
    var start_date = new Date(startTime.replace(/-/g, "/"));
    var end_date = new Date(endTime.replace(/-/g, "/"));
    var ms = end_date.getTime() - start_date.getTime();
     //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
     //do something
    console.log("day = ", day);
    this.setData({
      amount:day-1
    })
   }
   if(setDate==0){   //选择今天
    var TIME = util.formatTime(new Date());
    var startTime=TIME;
    var endTime=date;
    console.log("结束时间：",endTime)
    var start_date = new Date(startTime.replace(/-/g, "/"));
    var end_date = new Date(endTime.replace(/-/g, "/"));
    var ms = end_date.getTime() - start_date.getTime();
     //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
     //do something
    console.log("day = ", day);
    this.setData({
      amount:day
    })
   }
   console.log("总打卡时间",this.data.amount)
   const db=wx.cloud.database()
   var label =this.data.label
   var setCoin=this.data.setCoin
   var rest=this.data.rest
   var content=this.data.content
   var amount=this.data.amount
   var title=this.data.title
   var that=this
   if(amount<rest){
    that.setData({informContent:"休息时间比总时间多噢"});
    this.setData({loadContent:''});
    return
   }
   if(amount==rest){
    this.setData({informContent:"休息时间和总时间一样多噢"});
    this.setData({loadContent:''});
    return
   }
   let num=0.2*amount;
   num = Math.floor(num * 1) / 1;
   console.log("num",num)
   if(rest<0||rest>(0.2*amount)){
    that.setData({informContent:"休息时间最多只能是"+num+"天噢"});
    this.setData({loadContent:''});
    return
   }
   if(amount<0){
    that.setData({informContent:"请输入正确的结束时间"});
    this.setData({loadContent:''});
    return
   }
   let app=getApp()
   let userCoin=app.globalData.user.coin
   let curCoin=userCoin-this.data.setCoin;
   
  let newTarget = {
    supervisor: [],//监督者ID列表
    like: [],//点赞用户列表
    label: label,//用户创建的目标的标签
    title: title, //目标标题
    content: content, //目标内容
    coin: Number(setCoin),//总的挑战金币数
    rest: Number(rest),//用户创建目标的休息天数
    time: new Date(),//用户创建目标的时间
    amount: Number(amount),//总打卡时间
    comment: 0,//用户该目标的评论数
    status: 0,//用户当前目标的状态
    record: 0,//用户目标打卡次数
    status: 0,//任务状态
    progress: 0.00,  //任务进度
    treeId: that.data.treeId //树苗的id
   }
   wx.cloud.callFunction({
    name: 'setCoin',
    data: {
      curCoin:curCoin
    },})
    .then(res => {
      console.log("金币减少成功")
    })
    .catch(err=>{
      console.log("减少失败")
      console.log(err);
    })
   db.collection('target').add({
     data:newTarget,
     success:function(res){
      console.log(res)
      that.setData({
        informContent:"成功创建目标",
        loadContent:''
        });
      
      //修改主界面数据
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      newTarget.tree = that.data.treeImage;
      newTarget._id = res._id;
      let targetComponent = prevPage.selectComponent('#target');
      console.log(targetComponent);
      let targets = targetComponent.data.targets;
      targets.unshift(newTarget);
      targetComponent.setData({targets:targets});
      console.log(targets);
      wx.navigateBack({})
     },
     fail(err){
       console.log(err);
     }
   })
},

init:function(){
  const db = wx.cloud.database();
  const userTable = db.collection('user');
  let app = getApp();
  userTable.get().then(res => {
    //判断是否注册
      //已注册
      console.log("已注册");
      this.setData({user:res.data[0]});
      app.globalData.user = res.data[0];
      console.log(res.data[0])
      this.setData({ loadContent: '' });
  },err=>{
    console.log("加载用户信息错误");
    this.setData({loadContent:''});
  })
},
 
  /**89
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("options",options)
      this.setData({treeId:options.treeId, treeImage:options.treeImage});
      this.init()
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