// pages/studyRoom/studyRoom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyRoom: null,
    loadContent: ""
  },
  back: function() {
    wx.navigateBack({});
  },
  getEmptyClassRoom: function() {
    /**
     * xqj: 星期几
     * zc: 周次,第几周
     * jc: 节次，第几节（具体参考教务系统选项）
     * return:{
     *    status: 请求状态，
     *    desc: 结果描述，
     *    data: 数据
     * }
     */
    this.setData({
      loadContent: "拼命加载中..."
    });
    //等待部署服务器
    let that = this;
    wx.request({
      url: 'http://localhost:5000/empty_classroom',
      method: 'GET',
      data: {
        'xqj': '1',
        'zc': '1',
        'jc': '7'
      },
      success: (res) => {
        console.log(res);
        if (res.data.status == "fail") {
          //请求失败，重新请求
          that.getEmptyClassRoom();
        } else {
          that.setData({
            emptyRoom: res.data.data,
            loadContent: ""
          });
          console.log(that.data.emptyRoom);
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //测试数据
    let emptyRoom = [{
        cdmc: "文新415",
        cdjylx: "教学类,活动类",
        zws: 60
      }, {
        cdmc: "文新416",
        cdjylx: "教学类,活动类",
        zws: 60
      }, {
        cdmc: "文新418",
        cdjylx: "教学类,活动类",
        zws: 60
      }, {
        cdmc: "理南210",
        cdjylx: "教学类,活动类",
        zws: 60
      },
      {
        cdmc: "理南602",
        cdjylx: "教学类,活动类",
        zws: 120
      },
      {
        cdmc: "理北312",
        cdjylx: "教学类,活动类",
        zws: 60
      },
    ]
    this.setData({
      emptyRoom: emptyRoom
    });
    //爬取教务系统信息的API
    // this.getEmptyClassRoom();
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