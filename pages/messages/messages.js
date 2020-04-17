// pages/messages/messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户所有目标的id
    user_targets:[],
    //评论列表
    comments:[],
    //点赞列表
    like:[],
    //当前展示的内容,like:点赞， comment:评论, wacth:"围观"
    current_show:"like",
    //当前选中的数据在其对应的数组的索引值
    current_index:-1,
    //新的评论数
    newCommentNum:0,
    //新的点赞数
    newLikeNum:0
  },

  backHome: function () {
    wx.navigateBack({});
  },

  operateMessage:function(e){
    //控制删除按钮的显示
    // console.log(e);
    //数据在数组中的索引
    let index = e.currentTarget.id;
    if(this.data.current_index != -1){
      //点击同一个则关闭删除按钮
      this.setData({ current_index: -1 });
    }
    else{
      this.setData({ current_index: index });
    }
  },

  deleteMsg:function(){
    //删除某条消息
    let index = this.data.current_index;
    let currentData = [];
    switch(this.data.current_show){
      case 'comment':{
        currentData = this.data.comments;
        break;
      }
      case 'like':{
        currentData = this.data.like;
        break;
      }
    }
    console.log(currentData[index]);
    let id = currentData[index]._id;
    let that = this;
    wx.cloud.callFunction({
      name:"deleteMsg",
      data:{
        tableName:that.data.current_show,
        id:id
      },
      success:function(res){
        console.log(res);
        that.setData({current_index:-1});
      },
      fail:function(err){
        console.log(err);
      }
    })
  },

  init:function(){
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('target').field({_id:true}).get().then(res=>{
      console.log(res);
      //用户所有的任务id
      let user_targets = [];
      for(let i=0;i<res.data.length;i++){
        user_targets.push(res.data[i]._id);
      }

      that.setData({user_targets:user_targets});
      //开启评论监听
      that.watchComment();
      //开启点赞监听
      that.watchLike();
      
      //获取评论
      wx.cloud.callFunction({
        name:'getComment',
        data:{
          user_targets:user_targets
        },
        success:function(res){
          console.log(res);
          let data = res.result.list;
          //获取日期
          for(let i=0;i<data.length;i++){
            data[i].time = data[i].time.substr(5,5);
          }
          that.setData({comments:data});
        },
        fail:function(err){
          console.log(err);
        }
      })

      //获取点赞
      wx.cloud.callFunction({
        name:"getLike",
        data:{
          user_targets: user_targets
        },
        success:function(res){
          let data = res.result.list;
          console.log(data);
          //获取日期
          for (let i = 0; i < data.length; i++) {
            data[i].time = data[i].time.substr(5, 5);
          }
          that.setData({ like: data });
        },
        fail:function(err){
          console.log(err);
        }
      })
    })
  },

  //监听点赞
  watchLike: async function () {
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const watcher = await db.collection('like')
      .field({
        target_id: true
      })
      .where({
        target_id: _.in(that.data.user_targets)
      })
      .watch({
        onChange: function (snapshot) {
          console.log('docs\'s changed events', snapshot.docChanges)
          console.log('query result snapshot after the event', snapshot.docs)
          console.log('is init data', snapshot.type === 'init')
          if (snapshot.type != 'init') {
            let docChanges = snapshot.docChanges;
            let targetsId = [];
            for (let i = 0; i < docChanges.length; i++) {
              targetsId.push(docChanges[i].doc.target_id);
            }
            wx.cloud.callFunction({
              name: "getLike",
              data: {
                user_targets: targetsId
              },
              success: function (res) {
                let data = res.result.list;
                console.log(res);
                //获取日期
                for (let i = 0; i < data.length; i++) {
                  data[i].time = data[i].time.substr(5, 5);
                }
                that.setData({ like: data });
                if (that.data.current_show != "like") {
                  //如果当前不是展示点赞，则在右上角显示新评论的提示
                  let newLikeNum = that.data.newLikeNum;
                  that.setData({ newLikeNum: newLikeNum + docChanges.length });
                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    console.log(watcher);
    this.setData({ likeWatcher: watcher });
  },


  //监听评论
  watchComment:async function(){
    let that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    const watcher =  await db.collection('comment')
    .field({
      target_id:true
    })
    .where({
      target_id:_.in(that.data.user_targets)
      })
      .watch({
        onChange: function (snapshot) {
          console.log('docs\'s changed events', snapshot.docChanges)
          console.log('query result snapshot after the event', snapshot.docs)
          console.log('is init data', snapshot.type === 'init')
          if (snapshot.type != 'init'){
            let docChanges = snapshot.docChanges;
            let targetsId = [];
            for (let i = 0; i < docChanges.length; i++) {
              targetsId.push(docChanges[i].doc.target_id);
            }
            wx.cloud.callFunction({
              name: "getComment",
              data: {
                user_targets: targetsId
              },
              success: function (res) {
                let data = res.result.list;
                //获取日期
                for (let i = 0; i < data.length; i++) {
                  data[i].time = data[i].time.substr(5, 5);
                }
                that.setData({ comments: data});
                if(that.data.current_show != "comment"){
                  //如果当前不是展示评论，则在右上角显示新评论的提示
                  let newCommentNum = that.data.newCommentNum;
                  that.setData({ newCommentNum: newCommentNum+docChanges.length});
                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    // console.log(watcher);
    this.setData({commentWatcher:watcher});
  },

  choose:function(e){
    // 选择显示点赞或评论
    // console.log(e);
    let target = e.currentTarget.dataset.target;
    // console.log(target);
    this.setData({ current_show: target, current_index:-1});
    //清空新消息的提示
    switch(target){
      case 'comment':{
        if(this.data.newCommentNum !=0){
          this.setData({newCommentNum:0});
        }
        break;
      }
      case 'like': {
        if (this.data.newLikeNum != 0) {
          this.setData({ newLikeNum: 0 });
        }
        break;
      }
    }
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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
    this.data.commentWatcher.close();
    this.data.likeWatcher.close()
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
