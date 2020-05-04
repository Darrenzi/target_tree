// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       //加载表示符，用于控制加载动画,当值为 "" 隐藏
       loadContent: "加载中...",
       //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
       informContent:"",
       targetList:Array , //用于存放获得的目标
       targetTouchStart:0,
       month:0,
       year:0,
       now_day:0,
       now_month:0,
       now_year:0,
       lastMonth:0,
       nextMonth:0,
       labelList:[
         {label:"全部",
         imagesrc:'/pages/createTarget/images/1.png'},
         {label:"运动",
         imagesrc:'/pages/createTarget/images/1.png'},
         {label:"工作",
         imagesrc:'/pages/createTarget/images/2.png'},
         {label:"剁手",
         imagesrc:'/pages/createTarget/images/3.png'},
         {label:"游戏",
         imagesrc:'/pages/createTarget/images/4.png'},
         {label:"早睡",
         imagesrc:'/pages/createTarget/images/5.png'},
         {label:"减肥",
         imagesrc:'/pages/createTarget/images/6.png'},
         {label:"学习",
         imagesrc:'/pages/createTarget/images/7.png'},
         {label:"自律",
          imagesrc:'/pages/createTarget/images/8.png'},],
       nowLabel:'',//表示现在所点击的标签
       current_index:0,
       NULL_targetList:2,//0表示该数组为空，1表示该数组不为空
       treeList:[],//用于存放树的地址

  },
  backHome: function () {
  wx.navigateBack({
  })
  },
  choose:function(e){
    this.setData({
      loadContent:'加载中...',
        treeList:[],
        targetList:[]
      })
    let that=this
    let index = e.currentTarget.id;
    const db = wx.cloud.database();
    const _ = db.command;
    this.setData({
      nowLabel:this.data.labelList[index].label
    })
    let nowLabel=this.data.labelList[index].label
    console.log(nowLabel)
    let dateField = this.getDateField(this.data.year, this.data.month);
    if(index==0){
       db.collection('target')
      .orderBy('time', 'desc')
      .where({
        time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)) , //大于第一天小于最后一天
      })
      .get()
      .then(res => {
        this.setData({targetList:res.data});
        for(let i=0;i<res.data.length;i++){
            
            this.setData({
              now_day:res.data[i].time.getDate(),
              now_month:res.data[i].time.getMonth()+1,
              now_year:res.data[i].time.getFullYear()
            })
            let curday="targetList[" + i +"].day"  
            let curmonth="targetList[" + i +"].month" 
            let curyear="targetList[" + i +"].year" 
            this.setData({
              [curday]:this.data.now_day,
              [curmonth]:this.data.now_month,
              [curyear]:this.data.now_year
            })
         }
         
         console.log("targetList",res.data)
         console.log(this.data.month,"月")
         if(this.data.targetList.length==0){
           this.setData({NULL_targetList:0});}
              else{this.setData({NULL_targetList:1});}
         let length=this.data.targetList.length;
          for(let j=0;j<length;j++){
            db.collection('tool')
            .where({
              _id:_.eq(this.data.targetList[j].treeId)
             })
            .get()
            .then(res => {
            console.log("res",res)
            let treeid = "targetList[" + j +"].src"  
            this.setData({
               [treeid]:res.data[0].path,
            })
            this.data.treeList.push(res.data[0])
            this.setData({
            loadContent:'',
            treeList: this.data.treeList
            })
          })
        }
        this.setData({loadContent:''})
      })
      .catch(err => {
        console.log(err);
       })
      this.setData({current_index:index});
      return;
      }
     this.setData({
       treeList:[],
       targetList:[]
     })
     console.log("nowlabel",nowLabel)
     db.collection('target')
     .orderBy('time', 'desc')
     .where({
      time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)) , //大于第一天小于最后一天
      label:_.eq(nowLabel)
    }).get()
      .then(res => {
        this.setData({targetList:res.data});
        for(let i=0;i<res.data.length;i++){
            
            this.setData({
              now_day:res.data[i].time.getDate(),
              now_month:res.data[i].time.getMonth()+1,
              now_year:res.data[i].time.getFullYear()
            })
            let curday="targetList[" + i +"].day"  
            let curmonth="targetList[" + i +"].month" 
            let curyear="targetList[" + i +"].year" 
            this.setData({
              [curday]:this.data.now_day,
              [curmonth]:this.data.now_month,
              [curyear]:this.data.now_year
            })
         }
         console.log(this.data.month,"月")
         console.log("长度：",this.data.targetList.length)
         if(this.data.targetList.length==0){this.setData({NULL_targetList:0});}
         else{this.setData({NULL_targetList:1});}
         let length=this.data.targetList.length;
         for(let j=0;j<length;j++){
           db.collection('tool')
           .where({
             _id:_.eq(this.data.targetList[j].treeId)
            })
           .get()
           .then(res => {
            let treeid = "targetList[" + j +"].src"  
            this.setData({
               [treeid]:res.data[0].path,
            })
           this.data.treeList.push(res.data[0])
           this.setData({
           loadContent:'',
           treeList: this.data.treeList
           })
         })
       }
       this.setData({
         loadContent:'',
       })
      })
      .catch(err => {
        console.log(err);
      })

      this.setData({loadContent:''})
      this.setData({current_index:index});
    if(index == this.data.current_index)return;
  },
  targetTouchStart:function(e){
    console.log(e)
    this.setData({ targetTouchStart: e.touches[0].pageX});
  },

  targetTouchEnd:function(e){
    let endX = e.changedTouches[0].pageX;
    let startX = this.data.targetTouchStart;
    let distance = endX - startX;
    console.log("distance",distance);
    if(distance>100){
      this.lastMonth();
    }
    if(distance<-100){
      this.nextMonth();
    }
  },

  lastMonth:function(){
    let month = this.data.month;
    if (month > 1) {
      this.setData({ month: month-1 });
    } else {
      this.setData({ year: this.data.year - 1, month: 12 });
    }
    this.setData({
      treeList:[]
    })
    this.getTargets();
  },

  nextMonth:function(){
    let month = this.data.month;
    let year = this.data.year;
    if(month < 12){
      this.setData({month:month+1});
    }else{
      this.setData({ year: year+1, month:1});
    }
    this.setData({
      treeList:[]
    })
    this.getTargets();
  },

  getDateField:function(year, month){
    //获得一个月的第一天以及最后一天
    let firstdate = new Date(year, month-1, 1, 0, 0, 0, 0);
    let lastdate = new Date(year, month, 0, 23, 59, 59, 59);
    console.log(firstdate, lastdate);
    return {
      firstDay: firstdate,
      lastDay: lastdate
    }
  },

  getTargets:function(e){
    console.log(this.data.year)
    let nowLabel=this.data.nowLabel;
    let dateField = this.getDateField(this.data.year, this.data.month);
    const db = wx.cloud.database();
    const _ = db.command;
    this.setData({
      loadContent:'加载中'
    })

    if(nowLabel==''||nowLabel=='全部'){
      db.collection('target')
      .orderBy('time', 'desc')
      .where({
        time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)),  //大于第一天小于最后一天
      }).get()
        .then(res => {
          this.setData({targetList:res.data});
        for(let i=0;i<res.data.length;i++){
            
            this.setData({
              now_day:res.data[i].time.getDate(),
              now_month:res.data[i].time.getMonth()+1,
              now_year:res.data[i].time.getFullYear()
            })
            let curday="targetList[" + i +"].day"  
            let curmonth="targetList[" + i +"].month" 
            let curyear="targetList[" + i +"].year" 
            this.setData({
              [curday]:this.data.now_day,
              [curmonth]:this.data.now_month,
              [curyear]:this.data.now_year
            })
         }
           console.log(this.data.month,"月")
           if(this.data.targetList.length==0){
             this.setData({NULL_targetList:0}); 
             this.setData({loadContent:''})
             return}
           else{this.setData({NULL_targetList:1});}
           let length=this.data.targetList.length;
           for(let j=0;j<length;j++){
             db.collection('tool')
             .where({
               _id:_.eq(this.data.targetList[j].treeId)
              })
             .get()
             .then(res => {
              let treeid = "targetList[" + j +"].src"  
              this.setData({
                 [treeid]:res.data[0].path,
              })
             this.data.treeList.push(res.data[0])
             this.setData({
             loadContent:'',
             treeList: this.data.treeList
             })
           })
         }
         this.setData({
           loadContent:''
         })
        })
        .catch(err => {
          console.log(err);
        })
        return
    }

    db.collection('target')
    .orderBy('time', 'desc')
    .where({
      time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)),  //大于第一天小于最后一天
      label:_.eq(this.data.nowLabel)
    }).get()
      .then(res => {
        this.setData({targetList:res.data});
        for(let i=0;i<res.data.length;i++){
            
            this.setData({
              now_day:res.data[i].time.getDate(),
              now_month:res.data[i].time.getMonth()+1,
              now_year:res.data[i].time.getFullYear()
            })
            let curday="targetList[" + i +"].day"  
            let curmonth="targetList[" + i +"].month" 
            let curyear="targetList[" + i +"].year" 
            this.setData({
              [curday]:this.data.now_day,
              [curmonth]:this.data.now_month,
              [curyear]:this.data.now_year
            })
         }
         console.log(this.data.month,"月")
         if(this.data.targetList.length==0){this.setData({NULL_targetList:0});}
         else{this.setData({NULL_targetList:1});}
         let length=this.data.targetList.length;
         for(let j=0;j<length;j++){
           db.collection('tool')
           .where({
             _id:_.eq(this.data.targetList[j].treeId)
            })
           .get()
           .then(res => {
           this.data.treeList.push(res.data[0])
           this.setData({
           loadContent:'',
           treeList: this.data.treeList
           })
         })
       }
       this.setData({
         loadContent:''
       })
      })
      .catch(err => {
        console.log(err);
      })
      this.setData({loadContent:''})

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    this.setData({ year: date.getFullYear(), month: date.getMonth()+1});
    this.getTargets();
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