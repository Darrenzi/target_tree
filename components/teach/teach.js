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
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach1.png",
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach21.png",
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach3.png",
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach4.png",
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach5.png",
      "cloud://test-e5a3a.7465-test-e5a3a-1301749733/tutorial/teach6.png"
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
