// pages/createTarget/createTarget.js
var util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   numbers:[50,100,200,600,800,1000],
   a:'<',
   change:false,
   change_1:true,
   change_2:true,
   label:'',
   setCoin:'',
   rest:'',
   record:'',
   content:'',
   date:'',
   changeView:false,
   changeView_1:false,
   amount:'',
   setDate:0,
   //加载表示符，用于控制加载动画,当值为 "" 隐藏
   loadContent: "加载中...",
   //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
   informContent:""
  },
  bindDateChange:function(e){  //获取多行滑动组件中的值
    this.setData({
      date: e.detail.value
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
  setTarget:function(e){
    this.setData({
      target:'做作业',
      label:'做作业'
    })
  },
  setTarget_1:function(e){
    this.setData({
      target:'阅读',
      label:'阅读'
    })
  },
  setTarget_2:function(e){
    this.setData({
      target:'运动',
      label:'运动'
    })
  },
  setTarget_3:function(e){
    this.setData({
      target:'早睡',
      label:'早睡'
    })
  },
  setTarget_4:function(e){
    this.setData({
      target:'减肥',
      label:'减肥'
    })
  },
  setTarget_5:function(e){
    this.setData({
      target:'变漂亮',
      label:'变漂亮'
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

  changeShowstatus:function(){   //
   var setCoin=this.data.setCoin
   var that=this
    if(setCoin<=0){
      that.setData({informContent:"请输入正确的数额"});
      return
     }
     var that=this
     that.setData({
      change:(!that.data.change),
      change_1:(!that.data.change_1)
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
    var that=this
    that.setData({
     change:true,
     change_1:true,
     change_2:false
    })
 },
  changeShowStatus_2:function(){
    this.setData({
      change:true,
      change_1:false,
      change_2:true
    })
  },
  getInput:function(e){
      this.setData({
        setCoin: e.detail.value
      })
  },
  getInputTarget:function(e){
      this.setData({
        label: e.detail.value
      })
  },
  getInputContent:function(e){
   this.setData({
    content:e.detail.value
   })
  },

 end:function(e){

   //显示加载动画
   this.setData({loadContent:"创建中..."});

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
   if(setDate==0){
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
   var record=this.data.record
   var content=this.data.content
   var amount=this.data.amount
   var that=this
   if(amount<=rest){
    that.setData({informContent:"请输入正确的结束时间"});
    this.setData({loadContent:''});
    return
   }
   if(rest<0){
    that.setData({informContent:"请输入正确的休息时间"});
    this.setData({loadContent:''});
    return
   }
   if(amount<0){
    that.setData({informContent:"请输入正确的结束时间"});
    this.setData({loadContent:''});
    return
   }
   
   db.collection('target').add({
     data:{
      supervisor:[],
      label:label,
      title:content, //title内容同content
      content:content,
      amount:Number(setCoin),
      record:Number(record),//打卡记录
      rest:Number(rest),
      time:new Date(),
      like:0,
      record:0,
      amount:amount,
      //任务进度
      progress:0.00,
      //树苗的id
      treeId:that.data.treeId
     },
     success:function(res){
       console.log(res)
      //  wx.showModal({
      //   title: '成功',
      //   content: '成功创建目标',
      //   showCancel: false
      //  })
      that.setData({informContent:"成功创建目标"});
     }
   }),
  wx.navigateTo({
    url: '../index/index',
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