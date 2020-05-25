// components/teach/teach.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:String,
      value:""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      '/images/coin_teach.jpg',
      '/images/target_teach.jpg',
      '/images/content_teach.jpg',
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    notShowTeach:function(){
      this.setData({
        content:'',
      });
      let data= true
      this.triggerEvent('notShowTeach', data) 
    }
    
  }
})
