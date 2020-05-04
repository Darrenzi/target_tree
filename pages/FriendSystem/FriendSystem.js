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
     now_rank:0,//表示用户今天的排位
     now_coin:0,//表示用户今天的金币
     myself:'',//用户自己的openid
     tempSort:[],//暂时存放排序结果
     temp_5:[],//用于存放前五天的数据
     dbrank:[],//用于存放从数据库中拉取下来的排名
     mydbrank:[],//用于存放当天的自己以及好友的各种东西
     sortfriend:[],//用于存放好友排名中从数据库拉下来的数据的数组
     
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
      change_3: true,
    })
    this.setData({
      tempSort:[],
      mydbrank:[]
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
      console.log(this.data.tempSort)
      let navlen=this.data.navList.length
      for(let i=0;i<navlen;i++){
        this.data.tempSort.push(this.data.navList[i].friendList[0])
      }
    //获取当前五天的所有人的记录
     let curDate =new Date();
     console.log("curdate",curDate)
     db.collection('rank')
     .orderBy('time','desc')
     .limit(5)
     .get()
     .then(res=>{
      console.log("currank",res)
      this.setData({
        temp_5:res.data
      })
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
        today:this.data.temp_5[m].time.toLocaleDateString()
      })
      console.log("today",this.data.today)
      console.log("dbrank",this.data.dbrank);
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
      console.log("sort",mydbrank.sort(compare('coin')))
      this.setData({
        mydbrank:mydbrank.sort(compare('coin'))
      })
      let lenmybrank=this.data.mydbrank.length
      console.log("lenmydbrank",lenmybrank)
      console.log(this.data.myself)
      let now_rank=this.data.now_rank
      let now_coin=this.data.now_coin
      for(let k=0;k<lenmybrank;k++){
          if(mydbrank[k]._openid==this.data.myself){
            console.log("eq",mydbrank[k])
            this.setData({
              now_rank:now_rank+1,
            })
            this.data.now_coin=mydbrank[k].coin
            console.log("coin",now_coin)
            break;
          }
        now_rank++;
      }
      console.log("now_rank",this.data.now_rank)
      let coin = "sortfriend[" + m +"].coin"   
      let avatarUrl= "sortfriend[" + m +"].avatarUrl"  
      let date="sortfriend[" + m +"].date"  
      let rank="sortfriend[" + m +"].rank"  
      this.setData({
           [coin]:this.data.now_coin,
           [avatarUrl]:mydbrank[0].avatarUrl,
           [date]:this.data.today,
           [rank]:this.data.now_rank
        })
      this.setData({
        sortfriend:this.data.sortfriend
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
      tempSort:[]
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
      console.log(this.data.tempSort)
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
    console.log("sort",tempSort.sort(compare('coin')))
    this.setData({
      tempSort:tempSort.sort(compare('coin'))
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
    // console.log(user.un, user.avatarUrl, user._openid);
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
    this.setData({
      myself:userOpenid
    })
    console.log("userOpenid",userOpenid);
    wx.cloud.callFunction({
      name: 'friend',})
      .then(res=>{
        console.log("friend",res)
        this.setData({
          navList:res.result.list,
        })
        this.setData({
          navList:this.data.navList
        })
        wx.cloud.callFunction({
          name: 'friend_1',})
          .then(res=>{
            console.log("friend",res)
            this.setData({
              temp:res.result.list,
              
            })
            let L_length=this.data.temp.length;
            console.log("L_length",L_length)
            this.setData({
              navList:this.data.navList.concat(this.data.temp)
            })
          })
         
        var length=this.data.navList.length;
        console.log("N_length",length)
        console.log("navlist",this.data.navList)
      })
      
      // wx.cloud.callFunction({
      //   name: 'friend_1',})
      //   .then(res=>{
      //     console.log("friend",res)
      //     this.setData({
      //       temp:res.result.list
      //     })
      //     let L_length=this.data.temp.length;
      //     console.log("L_length",L_length)
      //   })
       wx.cloud.callFunction({
         name:'stranger',
       }).then(res=>{
        console.log(res)
        this.setData({
        userList:res.result.data
      })
     })

    // wx.cloud.callFunction({
    //   name:'sort',
    // }).then(res=>{
    //   console.log(res)
    //   this.setData({
    //     sortfriend:res.result.data
    //   })
    // })
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