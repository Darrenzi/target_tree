
Page({

  /**
   * 页面的初始数据
   */
  data: {
     change_1:false,
     change_2:true,
     change_3:true,
     navList:[],
  },

  
  
  changeShowStatus:function(){
    var that = this
    that.setData({
      change_1:false,
      change_2: true,
      change_3:true
    })
  },

  changeShowStatus_2: function () {
    var that = this
    that.setData({
      change_1: true,
      change_2:false,
      change_3: true
    })
  },
  changeShowStatus_3: function () {
    var that = this
    that.setData({
      change_1: true,
      change_2: true,
      change_3: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'friend',
      complete: res => {
        console.log('callFunction test result: ',res)
        var that=this
        that.setData({
          navList:res
        })
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

  },

  
})