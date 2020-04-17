// pages/mall/mall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:null,
    trees:[],
    //加载表示符，用于控制加载动画,当值为 "" 隐藏
    loadContent:"加载中...",
    progress:["10-29", "30-59", "60-89", "90-100"],
    tips:{
      success:"购买成功！",
      repeat:"您已经拥有此树苗",
      lack:"抱歉，你剩余的金币不足，赶紧多种树赚取更多金币吧。",
      err:"好像出现了某些错误..."
    }
  },

  backHome:function(){
    wx.navigateBack({});
  },

  topChoose:function(){
    //选中经典树苗或高级
    let inform = "此功能暂未开放，敬请期待..."
    this.setData({inform:inform});
  },

  closeDetail:function(){
    //关闭详细窗口
    this.setData({current:null});
  },

  choose:function(e){
    //点击某个树苗
    this.setData({current:e.currentTarget.dataset.tree});
    console.log(this.data.current);
  },

  buy:function(){
    let confirm = {
      title:"购买此树苗？",
      content:"你确定要花费 "+this.data.current.price+" 金币购买 "+this.data.current.name+" 吗?"
    }
    this.setData({confirm:confirm});
  },

  confirm:function(){
    //显示加载动画
    this.setData({loadContent:"购买中..."})
    const db = wx.cloud.database();
    let that = this;
    db.collection('user').field({
      coin:true,
      tools:true
    }).get().then(res=>{
      let coin = res.data[0].coin;
      let tools = res.data[0].tools;
      let _id = res.data[0]._id;
      // console.log(coin, tools);
      //判断是否已经拥有
      if(tools.indexOf(that.data.current._id)!=-1){
        let inform = that.data.tips.repeat;
        that.setData({inform:inform, confirm:{}, loadContent:""});
        return;
      }
      //判断金币是否充足
      if(coin < this.data.current.price){
        let inform = that.data.tips.lack;
        that.setData({ inform: inform, confirm: {}, loadContent: ""});
        return;
      }
      
      const _ = db.command;
      db.collection('user').doc(_id).update({
        data:{
          coin: (coin - that.data.current.price),
          tools: _.push(that.data.current._id)
        },
        success:function(res){
          // console.log(res);
          let inform = that.data.tips.success;
          that.setData({ inform: inform, confirm: {}, loadContent: ""});
        },
        fail:function(err){
          let inform = that.data.tips.err;
          that.setData({ inform: inform, confirm: {}, loadContent: ""});
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.cloud.callFunction({
      "name":"getTree",
      success:function(res){
        console.log(res);
        that.setData({trees:res.result.data, loadContent:""});
      }
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

  }
})