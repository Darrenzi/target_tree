// components/delete_tree/delete_tree.js
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
    "judge":false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
   ok:function(){
     var that=this;
     that.setData({
     judge:(!that.data.judge),
     })
   }
   
  }
})
