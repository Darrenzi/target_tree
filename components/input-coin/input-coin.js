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
    loadContent:"",
    confirmContent:"",
    confirmTitle:""
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
      //输入框点击确定
      if (this.data.coin == "" || isNaN(this.data.coin)){
        let informContent = "请输入投币金额";
        this.setData({ informContent: informContent, loadContent: '' });
        return;
      }
      let confirmContent = "是否确定投入 " + this.data.coin + " 金币？";
      this.setData({confirmTitle:"赞赏确认", confirmContent:confirmContent});
    },

    confirm:function(){
      //确定框点击确定
      console.log(this.properties.inputCoinMsg)
      this.setData({loadContent:"正在投币...", confirmTitle:"", confirmContent:""});
      // console.log(this.properties.inputCoinMsg.userCoin, this.data.coin);
      if (this.data.coin == "" || isNaN(this.data.coin)){
        let informContent = "请输入投币金额";
        this.setData({ informContent: informContent, loadContent: '' });
        return;
      }

      if(this.properties.inputCoinMsg.userCoin < this.data.coin){
        let informContent = "金币不足, 剩余金币数:" + this.properties.inputCoinMsg.userCoin;
        this.setData({ informContent: informContent, loadContent:''});
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
          var eventDetail = { coin: Number(that.data.coin) } // detail对象，提供给事件监听函数
          var eventOption = {} // 触发事件的选
          that.triggerEvent('addCoin', eventDetail, eventOption)
          that.setData({ loadContent: "", informContent: "对方已受到您的赞赏，感谢您的支持", hidden: true, coin: ""});
        },
        fail:function(err){
          console.log(err);
        }
      })
    }
  }
})
