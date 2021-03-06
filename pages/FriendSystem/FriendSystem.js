Page({

  /**
   * 页面的初始数据
   */
  data: {
     a:'<',
     change_1:false,
     change_2:true,
     change_3:true,
     temp:[],
     navList:[],//好友列表
     userList:[], //用于存放除了用户及其好友的数组
     temp:[],
     loadContent:'',
     informContent:'',
     today:'5月1日',
     now_month:0,
     now_day:0,
     a:'',
     now_rank:0,//表示用户今天的排位
     now_coin:0,//表示用户今天的金币
     myself:'',//用户自己的openid
     myselfName:'',//用户自己的用户名
     tempSort:[],//暂时存放排序结果
     temp_5:[],//用于存放前五天的数据
     dbrank:[],//用于存放从数据库中拉取下来的排名
     mydbrank:[],//用于存放当天的自己以及好友的各种东西
     sortfriend:[],//用于存放好友排名中从数据库拉下来的数据的数组
     hidden:true,
     sendedFriend:[],//用于存放拉取的已经发送的好友的请求
     friendName:'',//用户输入的好友名字
     friendId:'',//用户输入的好友的openid
     inputValue:'',
     getFriendName:[],//用于存放用户从数据库中找到同名的数据
     showSameName:true,//查询后展示查询到的结果
    },
  backHome: function () {
    wx.navigateBack({})
  },

  findfriend:function(){
    this.setData({
      hidden:false,
      getFriendName:[]
    })
  },
  return:function(){
    this.setData({
      hidden:true,
      friendName:'',
      inputValue:''
    })
  },
  backToCheck:function(){
    this.setData({
      friendName:''
    })
  },
  getInput:function(e){
    this.setData({
      friendName:e.detail.value
    })
  },

  check:function(){
    this.setData({
      friendName:this.data.friendName,
      loadContent:'正在搜索中...',
      hidden:true,
      showSameName:true
    })
    if(this.data.friendName==this.data.myselfName||this.data.friendName==''){
      this.setData({
        informContent:'用户不存在',
        hidden:true,
        loadContent:''
      })
      return
    }
    wx.cloud.callFunction({
      name: 'sendFriendRequest',
      data: {
        friendName:this.data.friendName
      },})
      .then(res => {
        this.setData({
          loadContent:''
        })
     
        if(res.result.data.length==0){
          this.setData({
            informContent:'用户不存在',
            hidden:true,
            inputValue:''
          })
          return
        }
        this.setData({
          getFriendName:res.result.data,
          hidden:true,
          showSameName:false,
          inputValue:'',
          
        })
      })
      .catch(err=>{
        console.log(err)
      })
  },
  addFriend:function(e){
    let app=getApp()
    let userOpenid=app.globalData.user._openid
    const db=wx.cloud.database()
    const _=db.command
    let index = e.currentTarget.id;
    let receiver=this.data.getFriendName[index]._openid
    this.setData({
      a:receiver
    })
    let navListLen=this.data.navList.length
    for(let i=0;i<navListLen;i++){  //检测是否已经是好友
      if(receiver==this.data.navList[i].friendList[0]._openid){
        this.setData({
          informContent:"你已经添加了这个好友啦",
          showSameName:'true'
        })
        return
      }
    }
    db.collection('friendRequest')  //检测是否已经发送过好友请求
    .get()
    .then(res=>{
       this.setData({
         sendedFriend:res.data
       })
       let sendLen=this.data.sendedFriend.length
       for(let m=0;m<sendLen;m++){
         if(receiver===this.data.sendedFriend[m].receiver&&this.data.sendedFriend[m].status===0&&this.data.sendedFriend[m]._openid===userOpenid)
         {
           this.setData({
             informContent:"发过了，正在等待对方处理~",
             showSameName:'true'
           })
         return
         }
       }
       db.collection('friendRequest')
       .add({
        data: {
         //接受好友请求的用户
         receiver:receiver,
         //接受请求的用户是否已经处理，-1已拒绝，0未处理，1已同意
         status:0,
         time: new Date()
       }
     })
     .then(res=>{
       this.setData({
         informContent:'好友请求已发送~',
         showSameName:true
       })
     })
    })
   
  },

  cancle:function(){
    this.setData({
      hidden:false,
      showSameName:true
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
      change_3: true,
    })
    this.setData({
      tempSort:[],
      mydbrank:[],
      loadContent:'加载中...'
    })
    const db=wx.cloud.database()
    const _=db.command
    db.collection('user')
    .where({
      _openid:_.eq(this.data.myself)
    })
    .get()
    .then(res=>{
      this.data.tempSort.push(res.data[0])
      this.setData({
        tempSort:this.data.tempSort
      })

      let navlen=this.data.navList.length
      for(let i=0;i<navlen;i++){
        this.data.tempSort.push(this.data.navList[i].friendList[0])
      }
    //获取当前五天的所有人的记录
     let curDate =new Date();
     db.collection('rank')
     .orderBy('time','desc')
     .limit(5)
     .get()
     .then(res=>{
      this.setData({
        temp_5:res.data
      })
      if(this.data.temp_5.length===0){
        this.setData({
          loadContent:'',
        })
        return
      }
      //匹配每一天天记录中的好友并将结果放到mydbrank
      let lenOftem5=this.data.temp_5.length
      for(let m=0;m<lenOftem5;m++){
      this.setData({
        dbrank:this.data.temp_5[m].rankList,
        now_rank:0,
        now_coin:0,
        mydbrank:[]
      })
      this.setData({
        today:this.data.temp_5[m].time.toLocaleDateString(),
        now_day:this.data.temp_5[m].time.getDate(),
        now_month:this.data.temp_5[m].time.getMonth()+1
      })
      let templen=this.data.tempSort.length   //tempsort存放着关于用户及用户好友的信息
      let dbranklen=this.data.dbrank.length   //dbrank存放着当日所有用户的排名
      for( let j=0;j<templen;j++){
         for(let m=0;m<dbranklen;m++){
           if(this.data.dbrank[m]._openid==this.data.tempSort[j]._openid){
             this.data.mydbrank.push(this.data.dbrank[m])
             this.setData({
               mydbrank:this.data.mydbrank
             })
             break
           }
         }
      }
      //对获得的记录进行排序
      function compare(property){  //定义一个按照金币数排名的列表
        return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
        }
      }
      let mydbrank=this.data.mydbrank
      this.setData({
        mydbrank:mydbrank.sort(compare('coin'))
      })
      let lenmybrank=this.data.mydbrank.length
    
      let now_rank=this.data.now_rank
      for(let k=0;k<lenmybrank;k++){
          if(mydbrank[k]._openid==this.data.myself){
            this.setData({
              now_rank:now_rank+1,
            })
            this.data.now_coin=mydbrank[k].coin
   
            break;
          }
        now_rank++;
      }
   
      let coin = "sortfriend[" + m +"].coin"   
      let avatarUrl= "sortfriend[" + m +"].avatarUrl"  
      let date="sortfriend[" + m +"].date"  
      let rank="sortfriend[" + m +"].rank"  
      let day="sortfriend[" + m +"].day"  
      let month="sortfriend[" + m +"].month"  
      this.setData({
           [coin]:this.data.now_coin,
           [avatarUrl]:mydbrank[0].avatarUrl,
           [date]:this.data.today,
           [rank]:this.data.now_rank,
           [day]:this.data.now_day,
           [month]:this.data.now_month
        })
      this.setData({
        sortfriend:this.data.sortfriend,
        loadContent:''
      })
     }
    })
  })
},

  ChangeShowStatus_3: function () {
    var that = this
    that.setData({
      change_1: true,
      change_2: true,
      change_3: false
    })
    this.setData({
      tempSort:[],
      loadContent:'加载中...'
    })
    const db=wx.cloud.database()
    const _=db.command
    db.collection('user')
    .where({
      _openid:_.eq(this.data.myself)
    })
    .get()
    .then(res=>{
      this.data.tempSort.push(res.data[0])
      this.setData({
        tempSort:this.data.tempSort
      })
  
      let navlen=this.data.navList.length
      for(let i=0;i<navlen;i++){
        this.data.tempSort.push(this.data.navList[i].friendList[0])
      }
    function compare(property){  //定义一个按照金币数排名的列表
      return function(a,b){
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
      }
    }
    let tempSort=this.data.tempSort
  
    this.setData({
      tempSort:tempSort.sort(compare('coin')),
      loadContent:''
    })
    
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
 
    wx.navigateTo({
      url: '../friendDetail/friendDetail?un='+user.un+"&avatarUrl="+user.avatarUrl+"&userId="+user._openid
    })
  },
  init:function(){
   this.setData({
     loadContent:'加载好友中...'
   })
   
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    let app=getApp()
    let userOpenid=app.globalData.user._openid
    let userUn=app.globalData.user.un
    this.setData({
      myself:userOpenid,
      myselfName:userUn,
      loadContent:'加载中...'
    })

    wx.cloud.callFunction({
      name: 'friend',})
      .then(res=>{
        
        this.setData({
          navList:res.result.list,
        })
        this.setData({
          navList:this.data.navList
        })
        wx.cloud.callFunction({
          name: 'friend_1',})
          .then(res=>{
            this.setData({
              temp:res.result.list,   
            })
            let L_length=this.data.temp.length;
            this.setData({
              navList:this.data.navList.concat(this.data.temp)
            })
          })
        var length=this.data.navList.length;
    
      })

    this.init()
    this.setData({
      loadContent:''
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