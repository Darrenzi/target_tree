// components/date/date.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    targetId:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [],
    recordList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDayCount: function (year, month) {
      let dayCount;
      let now = new Date(year, month, 0);
      dayCount = now.getDate();
      return dayCount;
    },
  },
  
  attached:function(){
    //获取这个月的第一天
    let current = new Date();
    let year = current.getFullYear();
    let month = current.getMonth() + 1;
    let firstdate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    //获得这个月的天数
    let dayCount = this.getDayCount(year, month);
    let dateList = [];
    for (let i = 1; i <= dayCount; i++) {
      let date = {};
      date.date = i;
      date.record = false;
      dateList.push(date);
    }
    this.setData({ dateList: dateList, firstdate: firstdate});
  },

  ready:function(){
    //获取有打卡的日子
    let targetId = this.properties.targetId;
    let firstdate = this.data.firstdate;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('record').where({
      time: _.gt(firstdate),
      target_id: _.eq(targetId)
    })
    .field({
        time: true
    })
    .get()
    .then(res => {
      let recordList = res.data;
      let dateList = this.data.dateList;
      for (let i = 0; i < recordList.length; i++) {
        let day = recordList[i].time.getDate() - 1;
        dateList[day].record = true;
      }
      this.setData({dateList: dateList});
    })
    .catch(err => {
      console.log(err);
    })
  }

})
