// components/target/target.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    //当前选中的目标的索引值
    current_index:-1,
    targets:[
      {tip:"学习", progress:30},
      { tip: "学习", progress: 30 },
      { tip: "学习", progress: 30 },
      { tip: "学习", progress: 30 },
      { tip: "学习", progress: 30 },
      { tip: "学习end", progress: 30 },
    ]
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
      targets.unshift( {tip:"new", progress:0});
      this.setData({targets:targets});
    },
  },
  
  created:function(){

  }
})
