//pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    user: null,
    //新消息的总数
    allNewMsgNum: 0,

    //当前选中的目标
    currentTarget: null,
    //当前选中目标的索引值
    currentTargetIndex:0,
    //储存跳转到计时界面前的目标
    currentTimeTarget: null,
    //是否打开左侧的选择栏
    leftOptionsFlag: false,
    //加载表示符，用于控制加载动画,当值为 "" 隐藏
    loadContent: "加载中...",
    //通知窗口表示符，用于控制加载动画,当值为 "" 隐藏
    informContent: "",

    //显示选择树苗的窗口
    addTargetFlag: false,
    //用户拥有的树苗
    userTrees: [],

    //显示目标详细信息的标识符
    showTargetFlag: false,

    //用于树木显示动画的控制
    treeShow: false,
    treeHeight: 0,
    treeOpacity: 0,

    //从何处跳转到该界面
    originPage:""
  },

  //初始化用户信息
  initUser: function() {
    console.log("init");
    let user = getApp().globalData.user;
    this.setData({
      user: user,
      initUserFlag:true
    });

    try {
      //获取存储在本地的最后拉取消息的时间戳
      var lastDateString = wx.getStorageSync('lastDate');
      if (lastDateString != "") {
        //本地有记录
        var lastDate = JSON.parse(lastDateString);

        this.setData({
          lastDate: lastDate
        });
      } else {
        //本地无记录
        var lastDate = {
          likeTimeStamp: 0,
          commentTimeStamp: 0,
          newFriendTimeStamp: 0,
          tipTimeStamp: 0
        };
        this.setData({
          lastDate: lastDate
        });
      }
    } catch (e) {
      var lastDate = {
        likeTimeStamp: 0,
        commentTimeStamp: 0,
        newFriendTimeStamp: 0,
        tipTimeStamp: 0
      };
      this.setData({
        lastDate: lastDate
      });
    }

    let that = this;
    wx.cloud.callFunction({
        name: "getNewMsgNum",
        data: {
          lastDate: lastDate
        }
      })
      .then(res => {
        if (res.result > 0) {
          that.setData({
            allNewMsgNum: res.result
          });
        }
      })
      .catch(err => {
        console.log(err);
        that.setData({
          allNewMsgNum: 0
        });
      })

    this.getUserTree();
  },

  addTarget: function() {

    if (this.data.addTargetFlag) {
      this.setData({
        addTargetFlag: false
      });
    } else {
      this.setData({
        addTargetFlag: true
      });
    }
  },

  chooseTree: function(e) {
    //创建新目标的时选中的树的id

    let treeId = e.currentTarget.dataset.treeid;
    let treeImage = e.currentTarget.dataset.treeimage;

    this.setData({
      loadContent: "正在路上..."
    })
    let that = this;
    wx.navigateTo({
      url: '../createTarget/createTarget?treeId=' + treeId + "&treeImage=" + treeImage,
      success: function() {
        that.setData({
          addTargetFlag: false,
          loadContent: ''
        });
      },
      fail: function() {

      },
      complete: function() {
        that.setData({
          loadContent: ''
        });
      }
    })
  },

  showTargetDetail: function() {
    if (this.data.currentTarget == undefined) return;
    //点击树木显示目标详情
    if (this.data.showTargetFlag) {
      this.setData({
        showTargetFlag: false
      });
    } else {
      this.setData({
        showTargetFlag: true
      });
    }
  },

  getUserTree: function() {
    //获取用户所拥有的树苗
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;

    db.collection('tool')
      .field({
        path: true
      })
      .where({
        _id: _.in(that.data.user.tools)
      }).get()
      .then(res => {
        that.setData({
          userTrees: res.data,
          loadContent: ''
        });
      })
      .catch(err => {
        console.log(err)
        that.setData({
          loadContent: ''
        });
      })
  },

  controlLeftOptions: function() {
    //控制左侧选择栏的开关
    if (this.data.leftOptionsFlag) {
      this.setData({
        leftOptionsFlag: false
      });
    } else {
      this.setData({
        leftOptionsFlag: true
      });
    }
  },

  chooseTarget: function(e) {
    //选择目标
    console.log(e.detail);
    this.setData({
      currentTarget: e.detail.target,
      currentTargetIndex:e.detail.index,
      treeShow: false
    });
  },

  imageLoadCompleted: function() {

    //树木图片加载完成后
    this.treeAnimation();
  },

  reachTo: function(e) {
    //左侧选择栏的导航函数
    this.setData({
      currentTarget: e.detail.target,
      loadContent: "正在路上..."
    });
    let target = e.currentTarget.dataset.target;

    let that = this;
    switch (target) {
      case '我的森林':
        {

          wx.navigateTo({
            url: '../forest/forest',
            complete: function() {
              that.setData({
                loadContent: ''
              });
            }
          })
          break;
        }
      case '我的好友':
        {

          wx.navigateTo({
            url: '../FriendSystem/FriendSystem',
            complete: function() {
              that.setData({
                loadContent: ''
              })
            }
          })
          break;
        }
      case '最新消息':
        {
          wx.navigateTo({
            url: '../messages/messages',
            fail: function(err) {
              console.log(err);
            },
            complete: function() {
              that.setData({
                loadContent: '',
                allNewMsgNum: 0
              });
            }
          })
          break;
        }
      case '商城':
        {

          wx.navigateTo({
            url: '../mall/mall?coin=' + this.data.user.coin,
            complete: function() {
              that.setData({
                loadContent: ''
              });
            }
          })
          break;
        }
      case '时间历程':
        {
          wx.navigateTo({
            url: '../history/history',
            complete: function() {
              that.setData({
                loadContent: ''
              });
            }
          })
          break;
        }
      case '社区':
        {
          wx.navigateTo({
            url: '../community/community',
            complete: function() {
              that.setData({
                loadContent: ''
              });
            }
          })
          break;
        }
      case '设置':
        {
          wx.navigateTo({
            url: '../config/config',
            complete: function() {
              that.setData({
                loadContent: ''
              });
            }
          })
          break;
        }
      default:
        {
          that.setData({
            loadContent: ''
          });
        }
    }
  },

  record: function() {
    //打卡
    if (this.data.currentTarget == undefined) return;
    this.setData({
      loadContent: '正在加载...'
    });
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    let currentTarget = this.data.currentTarget;

    //判断目标是否已经失败
    let currentTimeStamp = Number(new Date());
    let startTimeStamp = Number(currentTarget.time);
    //计算目标确立时间到当前的天数
    let dayNum = ((currentTimeStamp - startTimeStamp) / 86400000).toFixed(0);
    //没有打卡的次数
    let noRecordNum = dayNum - currentTarget.record;
    if (noRecordNum > currentTarget.rest) {
      //没有打卡天数大于休息的天数，认定为失败
      db.collection('target').doc(currentTarget._id)
        .update({
          data: {
            status: -1
          }
        })
        .then(res => {
          //将目标赌金的一半平分给围观用户
          let supervisor = currentTarget.supervisor;
          let reward = currentTarget.coin / (2 * supervisor.length);
          wx.cloud.callFunction({
            name: "rewardWatchUser",
            data: {
              supervisor: supervisor,
              reward: reward
            },
            fail: function(err) {
              console.log(err)
            }
          })
          //调用目标组件删除失败的目标
          let targetComponent = that.selectComponent('#target');
          targetComponent.deleteTarget();
          that.setData({
            loadContent: "",
            informContent: "目标已失败，损失 " + currentTarget.coin + " 金币，并种植一棵枯树"
          });
        })
        .catch(err => {
          console.log(err)
          that.setData({
            loadContent: '',
            informContent: "意外错误"
          });
        })
      return;
    }

    //获取表中最新打卡记录，判断时间，一天只能打卡一次
    let date = (new Date()).Format("yyyy-MM-dd");
    db.collection('record').field({
        time: true
      }).orderBy("time", 'desc').limit(1)
      .where({
        target_id: _.eq(that.data.currentTarget._id)
      })
      .get().then(res => {

        let lastDate = null;
        if (res.data.length != 0) {
          //取打卡表中的最后一次打卡记录，用于判断是否是同一天
          lastDate = (res.data[0].time).Format("yyyy-MM-dd");
        } else {
          //打卡表没有记录
          lastDate = "";
        }

        if (lastDate == date) {
          //判断时间，一天只能打卡一次
          that.setData({
            informContent: "您今天已经打卡,劳逸结合才能坚持到最后！",
            loadContent: ""
          });
        } else {

          //判断是否为计时目标
          if (currentTarget.type == "time") {
            wx.navigateTo({
              url: '../clock/clock?targetId=' + currentTarget._id + "&duration=" + currentTarget.duration+"&index="+this.data.currentTargetIndex,
            })
            this.setData({
              loadContent: ''
            });
            return;
          }

          //非计时目标直接添加记录
          this.addRecord();
        }
      })
  },

  addRecord: function(id) {
    console.log("打卡:"+id);
    var db = wx.cloud.database();
    if (id != undefined) {
      //表明该目标为计时目标，需重新拉取目标
      db.collection('target').doc(id).get().then(res => {
        console.log(res);
        var currentTarget = res.data;
        let targets = this.selectComponent('#target').data.targets;
        for(let i=0;i<targets.length;i++){
          if(currentTarget._id = targets[i]._id){
            currentTarget.tree = targets[i].tree;
            break;
          }
        }
        this.judgePhase(currentTarget);
      })
      .catch(err=>{
        console.log(err);
      });
      return;
    }

    this.judgePhase(this.data.currentTarget);
  },

  judgePhase: function(currentTarget) {
    //根据进度打卡
    var db = wx.cloud.database();
    var that = this;
    //完成后添加打卡记录
    db.collection('record').add({
      //添加打卡记录
      data: {
        target_id: currentTarget._id,
        time: new Date()
      }
    }).then(res => {
      //更新目标表中的打卡记录及任务进度
      let progress = ((currentTarget.record + 1) /currentTarget.amount * 100).toFixed(2);
      if (progress >= 100) {
        //打卡后任务完成
        that.completeTarget(currentTarget);
      } else {
        //打卡后任务未完成
        that.updateTarget(currentTarget, progress);
      }
    }).catch(err => {
      console.log(err)
      that.setData({
        loadContent: '',
        informContent: "意外错误"
      });
    })
  },

  updateTarget: function(currentTarget, newProgress) {
    //打卡后任务未完成
    console.log(currentTarget);
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('target').doc(currentTarget._id).update({
        data: {
          record: _.inc(1),
          progress: Number(newProgress)
        }
      }).then(res => {
        that.changeTargetTree(currentTarget, newProgress);
        //清空加载动画，设置通知内容
        that.setData({
          loadContent: '',
          informContent: "打卡成功！坚持的人最美丽！"
        });
      })
      .catch(err => {
        console.log(err)
        this.setData({
          loadContent: "",
          informContent: "意外错误"
        });
      })
  },

  changeTargetTree: function(currentTarget, newProgress) {
    //根据任务进度更改树木图片
    let userTrees = this.data.userTrees;
    let oldProgress = currentTarget.progress;
    let currentTree = null;
    let treeChangeFlag = false;
    for (let i = 0; i < userTrees.length; i++) {
      if (currentTarget.treeId == userTrees[i]._id) {
        currentTree = userTrees[i];
        break;
      }
    }
    if (oldProgress < 30 && newProgress >= 30) {
      //打卡后进度进入第二阶段
      currentTarget.tree = currentTree.path[1];
      treeChangeFlag = true;
    } else if (oldProgress < 60 && newProgress >= 60) {
      //打卡后进度进入第三阶段
      currentTarget.tree = currentTree.path[2];
      treeChangeFlag = true;
    } else if (oldProgress < 90 && newProgress >= 90) {
      //打卡后进度进入第四阶段
      currentTarget.tree = currentTree.path[3];
      treeChangeFlag = true;
    }
    //更新当前页面的数据
    currentTarget.record += 1;
    currentTarget.progress = newProgress;
    if(currentTarget._id == this.data.currentTarget._id){
      this.setData({
        currentTarget: currentTarget
      });
    }
    //更新组件中的数据
    let targetComponent = this.selectComponent('#target')
    targetComponent.update(currentTarget);
    if (treeChangeFlag) {
      targetComponent.choose({
        currentTarget: {
          id: 0
        }
      });
    }

  },

  completeTarget: function(currentTarget) {
    //打卡后任务完成
    let user = this.data.user;
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('target').doc(currentTarget._id).update({
        data: {
          record: _.inc(1),
          progress: 100,
          status: 1
        }
      }).then(res => {
        currentTarget.record += 1;
        currentTarget.progress = 100;
        //奖励金币=10倍的天数+赌金+赞赏
        let reward = 10 * currentTarget.amount + currentTarget.coin;
        user.coin += reward;

        db.collection("user").doc(user._id)
          .update({
            data: {
              coin: _.inc(reward)
            }
          })
          .then(res => {

            //调用目标组件删除完成的目标
            let targetComponent = that.selectComponent('#target');
            targetComponent.deleteTarget();

            // 更新数据，清空加载动画，设置通知内容
            that.setData({
              user: user,
              loadContent: '',
              informContent: "目标完成，获得 " + reward + " 金币"
            });
            getApp().globalData.user.coin = user.coin;
          })
          .catch(err => {
            console.log(err)
            this.setData({
              loadContent: "",
              informContent: "意外错误"
            });
          })
      })
      .catch(err => {
        console.log(err)
        this.setData({
          loadContent: "",
          informContent: "意外错误"
        });
      })
  },

  treeAnimation: function() {
    //创建树木动画
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    this.animation = animation;

    animation.height("200rpx").opacity(1).step();

    this.setData({
      treeAnimation: animation.export(),
    })

    let that = this;
    setTimeout(function() {
      that.setData({
        treeHeight: 0,
        treeOpacity: 0,
        treeShow: true,
        treeAnimation: null
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initUser();
    // if (options.origin == "timer") {
    //   //从计时器页面跳转来,表明计时完成
    //   let id = options._id;
    //   this.addRecord(id);
    // }
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
    if(this.data.originPage=="clock"){
      //从计时界面跳转过来，需要打卡记录
      this.addRecord(this.currentTargetIndex);
      this.setData({originPage:""});
    }
    // 触发组件的choose方法选中第一个目标
    this.selectComponent('#target').choose({
      currentTarget: {
        id: this.data.currentTargetIndex
      }
    });
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

//对Date类扩充格式化函数
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}