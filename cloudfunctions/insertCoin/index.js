// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let insertUserId = wxContext.OPENID;
  let receiver = event.receiver;
  let targetId = event.targetId;
  let targetTitle = event.targetTitle;
  let coin = Number(event.coin);
  console.log(event);
  const db = cloud.database();
  const _ = db.command;
  await db.collection('target').where({
    _id:_.eq(targetId)
  })
  .update({
    data:{
      coin:_.inc(coin)
    }
  })
  .then(res=>{
    console.log("修改目标金币成功");
  })
  .catch(err=>{
    console.log("目标金币数增加失败")
    console.log(err);
  })

  //扣除金币
  await db.collection('user').where({
    _openid: _.eq(insertUserId)
  })
    .update({
      data: {
        coin: _.inc(-coin)
      }
    })
  .then(res => {
      console.log(res);
  })
  .catch(err => {
    console.log("扣除用户金币失败")
    console.log(err);
  })

  //加入系统提醒
  await db.collection('tip').add({
    data: {
      //接受用户的openid
      receiver: receiver,
      title: "赞赏提醒",
      content: '标题为："' + targetTitle + '"的目标收到 ' + coin + ' 金币的赞赏',
      time: new Date()
    }
  })
  .then(res => {
    {
      console.log(res, "插入消息表成功");
    }
  })
  .catch(err => {
    console.log("插入消息提示表失败");
    console.log(err);
  })
}