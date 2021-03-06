// pages/forest/forest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //森林的缩放比例
    zoom:0.95,
    //当前月份
    month:0,
    //当前年份
    year:2020,
    forest: [],
    //统计的数据
    statistics:null,
    //加载动画中的内容
    loadContent: '正在收集树苗...',
    //当前显示的
    currentShow:'森林',
    //当前显示详情的目标的索引
    currentShowDetail: -1,
    //用户目标
    targets: [],

    //滑动开始的X坐标,森林的滑动切换
    forestTouchStartX:0
  },
  
  backHome: function () {
    wx.navigateBack({});
  },

  choose: function (e) {
    //选择显示的内容，森林或目标
    let target = e.currentTarget.dataset.target;
    this.setData({ currentShow: target });
  },

  showDetail: function (e) {
    //显示一个目标的详情
    let index = e.currentTarget.id;

    let currentShowDetail = this.data.currentShowDetail;
    if (currentShowDetail != index) {
      this.setData({ currentShowDetail: index });
    }
    else {
      this.setData({ currentShowDetail: -1 });
    }
  },

  targetDetail: function (e) {
    //跳转到某个目标的详情界面
    let user = getApp().globalData.user;
    let index = e.currentTarget.id;
    let target = this.data.targets[index];
    let un = user.un;
    let avatarUrl = user.avatarUrl;
    let title = target.title;
    let content = target.content;
    let targetId = target._id;
    let like = target.like.toString();
    let _id = target._id;
    let supervisor = target.supervisor.toString();
    let progress = target.progress;
    let coin = target.coin;
    let status = target.status;
    let _openid = user._openid;
    wx.navigateTo({
      url: '../targetDetail/targetDetail?un=' + un + "&avatarUrl=" + avatarUrl +
        "&title=" + title + "&content=" + content + "&targetId=" + targetId + "&like=" + like + "&_id=" + _id + "&supervisor=" + supervisor + "&progress=" + progress+"&coin="+coin+"&status="+status+"&_openid="+_openid,
    })
  },

  getDateField:function(year, month){
    //获得一个月的第一天以及最后一天
    let firstdate = new Date(year, month-1, 1, 0, 0, 0, 0);
    let lastdate = new Date(year, month, 0, 23, 59, 59, 59);

    return {
      firstDay: firstdate,
      lastDay: lastdate
    }
  },

  getStatistics:function(targets){
    //统计完成还有枯萎的树木的总量
    let completed = 0;
    let abandoned = 0;
    let running = 0;

    for(let i=0;i<targets.length;i++){
      if(targets[i].status==-1){
        abandoned+=1;
      }
      if(targets[i].status==1){
        completed+=1;
      }
      if(targets[i].status == 0){
        running +=1;
      }
    }
    this.setData({ statistics: {completed: completed,abandoned: abandoned, running:running} });
  },

  getTree:function(targetData){

    //获取用户目标的树苗的信息, treeId未定义会出现无法运行的错误
    let treeId =[];
    for(let i=0;i<targetData.length;i++){
      treeId.push(targetData[i].treeId);
    }

    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('tool')
    .field({
      path:true
    })
    .where({
      _id:_.in(treeId)
    }).get()
    .then(res=>{

      let forest = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
      for (let i = 0; i < targetData.length;i++){
        //根据目标的treeId,判断目标的树苗
        if(targetData[i].status == -1){
          //任务失败,加入枯树图片
          forest[i] = "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tools/枯树.png";
          continue;
        }
        for(let j=0;j<res.data.length;j++){
          if(treeId[i]==res.data[j]._id){
            //根据任务的进度压入不同的树木图片
            if (targetData[i].progress<30){
              forest[i] = res.data[j].path[0];
            }
            else if (targetData[i].progress < 60){
              forest[i] = res.data[j].path[1];
            }
            else if (targetData[i].progress < 90){
              forest[i] = res.data[j].path[2];
            }
            else{
              forest[i] = res.data[j].path[3];
            }
            break;
          }
        }
      }
      that.setData({forest:forest, loadContent:''});
    })
    .catch(err=>{
      
    })
  },


  getTargets: function () {
    //获取用户某个月的目标
    let dateField = this.getDateField(this.data.year, this.data.month);
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('target').where({
      time: _.gt(dateField.firstDay).and(_.lt(dateField.lastDay))
    })
    .orderBy("time","desc")
    .get()
      .then(res => {
  
        that.setData({targets:res.data});
        //统计各类树的总量
        that.getStatistics(res.data);
        that.getTree(res.data);
      })
      .catch(err => {
        console.log(err)
      })
  },

  nextMonth:function(){
    //显示加载动画
    this.setData({ loadContent: '正在收集树苗...' });
    let month = this.data.month;
    let year = this.data.year;
    if(month < 12){
      this.setData({month:month+1});
    }else{
      this.setData({ year: year+1, month:1});
    }
    this.getTargets();
  },

  lastMonth:function(){
    //显示加载动画
    this.setData({ loadContent: '正在收集树苗...' });
    let month = this.data.month;
    if (month > 1) {
      this.setData({ month: month - 1 });
    } else {
      this.setData({ year: this.data.year - 1, month: 12 });
    }
    this.getTargets();
  },

  forestTouchStart:function(e){
    //监听森林上的滑动,用于滑动切换判断

    this.setData({ forestTouchStartX: e.touches[0].pageX});
  },

  forestTouchEnd:function(e){
    //监听森林上的滑动,用于滑动切换判断
    let endX = e.changedTouches[0].pageX;
    let startX = this.data.forestTouchStartX;
    let distance = endX - startX;
    if(distance>100){
      this.lastMonth();
    }
    if(distance<-100){
      this.nextMonth();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前的时间
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