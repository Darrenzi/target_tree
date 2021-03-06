// components/target/target.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTarget:{
      type:Object,
      value:null,
      loadContent:''
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
      // if(index == this.data.current_index)return;
      this.setData({current_index:index});
      let target = this.data.targets[index]
      var eventDetail = { target: target, index:index} // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选
      this.triggerEvent('choose', eventDetail, eventOption)
    },

    add:function(){
      // console.log("添加目标");
      var eventDetail = {} // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选
      this.triggerEvent('add', eventDetail, eventOption)
    },

    update:function(currentTarget){
      //用于父组件调用，更新数据
      var index = -1;
      for(let i=0;i<this.data.targets.length;i++){
          if(currentTarget._id == this.data.targets[i]._id){
            currentTarget.tree = this.data.targets[i].tree;
            index= i;
            break;
          }
      }
      this.setData({ [`targets[${index}]`]: currentTarget});
      // console.log(currentTarget);
    },

    deleteTarget:function(){
      //用于父组件调用，删除某个目标
      let index = this.data.current_index;
      let targets = this.data.targets;
      targets.splice(index, 1);
      this.setData({targets:targets});
      //选择第一个
      let target = null;
      if(targets.length != 0){
        target = this.data.targets[0];
      }
      var eventDetail = { target: target } // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选
      console.log('delete');
      this.triggerEvent('choose', eventDetail, eventOption)
    },

    getTree:function(treeId){
      //根据treeId获取树木的数据
      const db = wx.cloud.database();
      const _ = db.command;
      let that = this;
      db.collection('tool').field({
        path:true
      })
      .where({
        _id:_.in(treeId)
      }).get()
      .then(res=>{
        let trees = res.data;
        let targets = that.data.targets;
        //判断目标的树苗
        for(let i=0;i<targets.length;i++){
          for(let j=0;j<trees.length;j++){
            if(targets[i].treeId == trees[j]._id){
              //根据进度，选中不同的树苗图片
              if(targets[i].progress<30){
                targets[i].tree = trees[j].path[0];
              }
              else if (targets[i].progress < 60) {
                targets[i].tree = trees[j].path[1];
              }
              else if (targets[i].progress < 90) {
                targets[i].tree = trees[j].path[2];
              }
              else {
                targets[i].tree = trees[j].path[3];
              }
              break;
            }
          }
        }
        that.setData({targets:targets});
        //默认选中第一个目标
        var target = targets[0];
        var eventDetail = { target: target } // detail对象，提供给事件监听函数
        var eventOption = {} // 触发事件的选
        this.triggerEvent('choose', eventDetail, eventOption)
      })
      .catch(err=>{
        console.log(err);
      })
    },

    init: async function () {
      const db = wx.cloud.database();
      const _ = db.command;
      let that = this;
      await db.collection('target')
        .where({
          status: _.eq(0)
        })
        .orderBy('time', 'desc')
        .get().then(
          res => {
            var targets = [];
            var treeId = [];
            for (let i = 0; i < res.data.length; i++) {
              if (treeId.indexOf(res.data[i].treeId) == -1) {
                treeId.push(res.data[i].treeId);
              }
            }
            that.setData({ targets: res.data });
            that.getTree(treeId);
          },
          err => {
            console.log('获取目标失败');
          }
        )
    }
  },
  
  created:function(){
    this.init();
  }
})
