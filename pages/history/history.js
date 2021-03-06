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
       progress:0,
      labelList:[
      {label:"全部",
      imagesrc:'/pages/createTarget/images/10.png'},
      {label:"兴趣",
      imagesrc:'/pages/createTarget/images/1.png'},
      {label:"减肥",
      imagesrc:'/pages/createTarget/images/15.png'},
      {label:"睡眠",
      imagesrc:'/pages/createTarget/images/14.png'},
      {label:"储钱",
      imagesrc:'/pages/createTarget/images/4.png'},
      {label:"学习",
      imagesrc:'/pages/createTarget/images/5.png'},
      {label:"运动",
      imagesrc:'/pages/createTarget/images/6.png'},
      {label:"颜值",
      imagesrc:'/pages/createTarget/images/16.png'},
      {label:"其他",
       imagesrc:'/pages/createTarget/images/11.png'}, ],
       showTargetRecord:false,    
       TargetsRecord:[],        
       nowLabel:'',//表示现在所点击的标签
       current_index:0,
       countIsZero:false,//是否打卡次数为空
       NULL_targetList:2,//0表示该数组为空，1表示该数组不为空
       treeList:[],//用于存放树的地址
       
  },


  //返回函数
  backHome: function() {
    wx.navigateBack({})
  },


  targetRecord:function(e){
         this.setData({
          showTargetRecord:true
         })
    let index = e.currentTarget.id;
    console.log("target:"+index)
    let target = this.data.targetList[index];
    console.log("curentTargert:"+target)
    let targetId=target._id;
    console.log("targetId:"+targetId)
    const db=wx.cloud.database();
  
    db.collection('record').where({
       target_id:targetId
    })
    .get()
    .then(res=>{
      console.log(res.data)
       this.setData({
        TargetsRecord:res.data
       })
       let recordLength=this.data.TargetsRecord.length;
       if(recordLength==0){
         this.setData({
           countIsZero:true
         })
         return
       }
       for(let i=0;i<recordLength;i++){
         let year=this.data.TargetsRecord[i].time.getFullYear();
         let month=this.data.TargetsRecord[i].time.getMonth()+1;
         let day=this.data.TargetsRecord[i].time.getDate();
        let recordYear="TargetsRecord["+i+"].year"  //为数组添加键值对
        let recordMonth="TargetsRecord["+i+"].month"
        let recordday="TargetsRecord["+i+"].date"
        this.setData({
           [recordYear]:year,
           [recordMonth]:month,
           [recordday]:day,
        })
       
       }
    })
  
  
  },

  //选择某个标签
  choose: function(e) {
    this.setData({
      loadContent: '加载中...',
      treeList: [],
      targetList: []
    })
    let index = e.currentTarget.id;
    const db = wx.cloud.database();
    const _ = db.command;
    this.setData({
      nowLabel: this.data.labelList[index].label
    })
    let nowLabel = this.data.labelList[index].label
    //全部标签
    let dateField = this.getDateField(this.data.year, this.data.month);
    if (index == 0) {
      db.collection('target')
        .orderBy('time', 'desc')
        .where({
          time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)), //大于第一天小于最后一天
        })
        .get()
        .then(res => {
          this.setData({
            targetList: res.data
          });
          for (let i = 0; i < res.data.length; i++) {

            this.setData({
              now_day: res.data[i].time.getDate(),
              now_month: res.data[i].time.getMonth() + 1,
              now_year: res.data[i].time.getFullYear()
            })
            let curday = "targetList[" + i + "].day" 
            let curmonth = "targetList[" + i + "].month" 
            let curyear = "targetList[" + i + "].year" 
            this.setData({
              [curday]: this.data.now_day,
              [curmonth]: this.data.now_month,
              [curyear]: this.data.now_year
            })
          }

          if (this.data.targetList.length == 0) {
            this.setData({
              NULL_targetList: 0
            });
          } else {
            this.setData({
              NULL_targetList: 1
            });
          }
          let length = this.data.targetList.length;
          for (let j = 0; j < length; j++) {
            db.collection('tool')
              .where({
                _id: _.eq(this.data.targetList[j].treeId)
              })
              .get()
              .then(res => {
                if (this.data.targetList[j].status == -1) {
                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: 'cloud://test-e5a3a.7465-test-e5a3a-1301749733/tools/枯树.png',
                  })
                  this.data.treeList.push(res.data[0])
                } else {
                  if (this.data.targetList[j].progress <= 29) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[0],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress > 29 && this.data.targetList[j].progress <= 59) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[1],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress > 59 && this.data.targetList[j].progress <= 89) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[2],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress >= 90 && this.data.targetList[j].progress <= 100) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[3],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                }
                this.setData({
                  loadContent: '',
                  treeList: this.data.treeList
                })
              })
          }
          this.setData({
            loadContent: ''
          })
        })
        .catch(err => {
          console.log(err)
        })
      this.setData({
        current_index: index
      });
      return;
    }
    this.setData({
      treeList: [],
      targetList: [],
    })

    db.collection('target')
      .orderBy('time', 'desc')
      .where({
        time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)), //大于第一天小于最后一天
        label: _.eq(nowLabel)
      }).get()
      .then(res => {
        this.setData({
          targetList: res.data
        });
        for (let i = 0; i < res.data.length; i++) {

          this.setData({
            now_day: res.data[i].time.getDate(),
            now_month: res.data[i].time.getMonth() + 1,
            now_year: res.data[i].time.getFullYear()
          })
          let curday = "targetList[" + i + "].day" 
          let curmonth = "targetList[" + i + "].month" 
          let curyear = "targetList[" + i + "].year" 
          this.setData({
            [curday]: this.data.now_day,
            [curmonth]: this.data.now_month,
            [curyear]: this.data.now_year
          })
        }

        if (this.data.targetList.length == 0) {
          this.setData({
            NULL_targetList: 0
          });
        } else {
          this.setData({
            NULL_targetList: 1
          });
        }
        let length = this.data.targetList.length;
        for (let j = 0; j < length; j++) {
          db.collection('tool')
            .where({
              _id: _.eq(this.data.targetList[j].treeId)
            })
            .get()
            .then(res => {
              if (this.data.targetList[j].status == -1) {
                let treeid = "targetList[" + j + "].src" 
                this.setData({ 
                  [treeid]: 'cloud://test-e5a3a.7465-test-e5a3a-1301749733/tools/枯树.png',
                })
                this.data.treeList.push(res.data[0])
              } else {
                if (this.data.targetList[j].progress <= 29) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[0],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress > 29 && this.data.targetList[j].progress <= 59) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[1],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress > 59 && this.data.targetList[j].progress <= 89) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[2],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress >= 90 && this.data.targetList[j].progress <= 100) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[3],
                  })
                  this.data.treeList.push(res.data[0])
                }
              }
              this.setData({
                loadContent: '',
                treeList: this.data.treeList
              })
            })
        }
        this.setData({
          loadContent: '',
        })
      })
      .catch(err => {
        console.log(err)
      })

    this.setData({
      loadContent: ''
    })
    this.setData({
      current_index: index
    });
    if (index == this.data.current_index) return;
  },
  targetTouchStart: function(e) {

    this.setData({
      targetTouchStart: e.touches[0].pageX
    });
  },

  targetTouchEnd: function(e) {
    let endX = e.changedTouches[0].pageX;
    let startX = this.data.targetTouchStart;
    let distance = endX - startX;

    if (distance > 85) {
      this.lastMonth();
    }
    if (distance < -85) {
      this.nextMonth();
    }
  },

  lastMonth: function() {
    this.setData({
      treeList: [],
      loadContent: "加载中..."
    });
    let month = this.data.month;
    if (month > 1) {
      this.setData({
        month: month - 1
      });
    } else {
      this.setData({
        year: this.data.year - 1,
        month: 12
      });
    }
    this.getTargets();
  },

  nextMonth: function() {
    this.setData({
      treeList: [],
      loadContent: "加载中..."
    });
    let month = this.data.month;
    let year = this.data.year;
    if (month < 12) {
      this.setData({
        month: month + 1
      });
    } else {
      this.setData({
        year: year + 1,
        month: 1
      });
    }
    this.getTargets();
  },

  getDateField: function(year, month) {
    //获得一个月的第一天以及最后一天
    let firstdate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    let lastdate = new Date(year, month, 0, 23, 59, 59, 59);

    return {
      firstDay: firstdate,
      lastDay: lastdate
    }
  },

  getTargets: function(e) {

    let nowLabel = this.data.nowLabel;
    let dateField = this.getDateField(this.data.year, this.data.month);
    const db = wx.cloud.database();
    const _ = db.command;
    this.setData({
      targetList: [],
    })
    if (nowLabel == '' || nowLabel == '全部') {
      db.collection('target')
        .orderBy('time', 'desc')
        .where({
          time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)), //大于第一天小于最后一天
        }).get()
        .then(res => {
          this.setData({
            targetList: res.data
          });
          for (let i = 0; i < res.data.length; i++) {

            this.setData({
              now_day: res.data[i].time.getDate(),
              now_month: res.data[i].time.getMonth() + 1,
              now_year: res.data[i].time.getFullYear()
            })
            let curday = "targetList[" + i + "].day" 
            let curmonth = "targetList[" + i + "].month" 
            let curyear = "targetList[" + i + "].year" 
            this.setData({
              [curday]: this.data.now_day,
              [curmonth]: this.data.now_month,
              [curyear]: this.data.now_year
            })
          }

          if (this.data.targetList.length == 0) {
            this.setData({
              NULL_targetList: 0
            });
            this.setData({
              loadContent: ''
            })
            return
          } else {
            this.setData({
              NULL_targetList: 1
            });
          }
          let length = this.data.targetList.length;
          for (let j = 0; j < length; j++) {
            db.collection('tool')
              .where({
                _id: _.eq(this.data.targetList[j].treeId)
              })
              .get()
              .then(res => {
                if (this.data.targetList[j].status == -1) {
                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: 'cloud://test-e5a3a.7465-test-e5a3a-1301749733/tools/枯树.png',
                  })
                  this.data.treeList.push(res.data[0])
                } else {
                  if (this.data.targetList[j].progress <= 29) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[0],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress > 29 && this.data.targetList[j].progress <= 59) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[1],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress > 59 && this.data.targetList[j].progress <= 89) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[2],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                  if (this.data.targetList[j].progress >= 90 && this.data.targetList[j].progress <= 100) {

                    let treeid = "targetList[" + j + "].src" 
                    this.setData({ 
                      [treeid]: res.data[0].path[3],
                    })
                    this.data.treeList.push(res.data[0])
                  }
                }
                this.setData({
                  loadContent: '',
                  treeList: this.data.treeList
                })
              })
          }
          this.setData({
            loadContent: ''
          })
        })
        .catch(err => {
          console.log(err)
        })
      return
    }

    db.collection('target')
      .orderBy('time', 'desc')
      .where({
        time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay)), //大于第一天小于最后一天
        label: _.eq(this.data.nowLabel)
      }).get()
      .then(res => {
        this.setData({
          targetList: res.data
        });
        for (let i = 0; i < res.data.length; i++) {

          this.setData({
            now_day: res.data[i].time.getDate(),
            now_month: res.data[i].time.getMonth() + 1,
            now_year: res.data[i].time.getFullYear()
          })
          let curday = "targetList[" + i + "].day" 
          let curmonth = "targetList[" + i + "].month" 
          let curyear = "targetList[" + i + "].year" 
          this.setData({
            [curday]: this.data.now_day,
            [curmonth]: this.data.now_month,
            [curyear]: this.data.now_year
          })
        }

        if (this.data.targetList.length == 0) {
          this.setData({
            NULL_targetList: 0
          });
        } else {
          this.setData({
            NULL_targetList: 1
          });
        }
        let length = this.data.targetList.length;
        for (let j = 0; j < length; j++) {
          db.collection('tool')
            .where({
              _id: _.eq(this.data.targetList[j].treeId)
            })
            .get()
            .then(res => {
              if (this.data.targetList[j].status == -1) {
                let treeid = "targetList[" + j + "].src" 
                this.setData({ 
                  [treeid]: 'cloud://test-e5a3a.7465-test-e5a3a-1301749733/tools/枯树.png',
                })
                this.data.treeList.push(res.data[0])
              } else {
                if (this.data.targetList[j].progress <= 29) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[0],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress > 29 && this.data.targetList[j].progress <= 59) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[1],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress > 59 && this.data.targetList[j].progress <= 89) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[2],
                  })
                  this.data.treeList.push(res.data[0])
                }
                if (this.data.targetList[j].progress >= 90 && this.data.targetList[j].progress <= 100) {

                  let treeid = "targetList[" + j + "].src" 
                  this.setData({ 
                    [treeid]: res.data[0].path[3],
                  })
                  this.data.treeList.push(res.data[0])
                }
              }
              this.setData({
                loadContent: '',
                treeList: this.data.treeList
              })
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
    this.setData({
      loadContent: ''
    })

  },


  recordBackHome:function(){
    this.setData({
      showTargetRecord:false,
      TargetsRecord:[],
      countIsZero:false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date();
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      loadContent: "正在加载中~"
    });
    this.getTargets();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})