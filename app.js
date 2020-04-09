//app.js
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  globalData:{
    user:null
  },

  //初始化用户信息
  initUser:function(){
    const db = wx.cloud.database();
    const userTable = db.collection('user');
    let that = this;
    userTable.get().then(res => {
      //判断是否注册
      if (res.data.length == 0) {
        console.log("用户还未注册");
        wx.navigateTo({
          url: '../register/register',
        })
      } else {
        //已注册
        console.log("已注册");
        that.globalData.user = res.data[0];
        console.log(that.globalData.user);
      }
    })
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }
    else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.initUser();
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
