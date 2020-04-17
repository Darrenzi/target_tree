// components/target/target.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTarget:{
      type:Object,
      value:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //当前选中的目标的索引值
    current_index:0,
    targets:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose:function(e){
      let index = e.currentTarget.id;
      if(index == this.data.current_index)return;
      this.setData({current_index:index});

      let target = this.data.targets[index]
      var eventDetail = { target: target} // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选
      this.triggerEvent('choose', eventDetail, eventOption)
    },

    add:function(){
      console.log("添加目标");
      let targets = this.data.targets;
      wx.navigateTo({
        url: '../../pages/createTarget/createTarget'
      })
      // targets.unshift( {tip:"new", progress:0});
      // this.setData({targets:targets});
    },

    update:function(currentTarget){
      //用于父组件调用，更新数据
      let index = this.data.current_index;
      this.setData({ [`targets[${index}]`]: currentTarget});
    }
  },
  
  created:function(){
    const db = wx.cloud.database();
    let that = this;
    db.collection('target')
    .orderBy('time', 'desc')
    .get().then(
      res=>{
        var targets = [];
        that.setData({targets:res.data});

        //默认选中第一个目标
        var target = res.data[0];
        var eventDetail = { target: target } // detail对象，提供给事件监听函数
        var eventOption = {} // 触发事件的选
        this.triggerEvent('choose', eventDetail, eventOption)
      },
      err=>{
        console.log('获取目标失败');
      }
    )
  }
})
