// components/input-coin/input-coin.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden:{
      type:Boolean,
      value:false
    },
    inputCoinMsg:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //输入的金币数
    coin:"",
    informContent:"",
    loadContent:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel:function(){
      this.setData({hidden:true, coin:""});
    },

    getCoin:function(e){
      //获得输入的金币
      console.log(e);
      this.setData({coin:Number(e.detail.value)});
    },

    centain:function(){
      console.log(this.properties.inputCoinMsg)
      this.setData({loadContent:"正在投币..."});
      if(this.properties.inputCoinMsg.userCoin < this.data.coin){
        console.log("金币不足");
        let informContent = "金币不足, 剩余金币数:" + this.properties.inputCoinMsg.userCoin;
        this.setData({ informContent: informContent});
        return;
      }
      let that = this;
      wx.cloud.callFunction({
        name:"insertCoin",
        data:{
          receiver: that.properties.inputCoinMsg.targetUserId,
          targetId: that.properties.inputCoinMsg.targetId,
          targetTitle: that.properties.inputCoinMsg.targetTitle,
          coin:that.data.coin
        },
        success:function(res){
          console.log(res);
          that.setData({coin:""});
          that.setData({loadContent:"", informContent:"对方已受到您的赞赏，感谢您的支持", hidden:true});
        },
        fail:function(err){
          console.log(err);
        }
      })
    }
  }
})
