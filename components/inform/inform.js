// components/inform/inform.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:String,
      value:"你好"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close:function(){
      this.setData({content:''});
      var eventDetail = {} // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选
      this.triggerEvent('close', eventDetail, eventOption)
    }
  }
})
