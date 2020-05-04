// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //任务失败时，将金币分给围观用户
  const db = cloud.database();
  const _ = db.command;
  let supervisor = event.supervisor;
  let reward = Number(event.reward);
  await db.collection('user').where({
    _openid:_.in(supervisor)
  })
  .update({
    data:{
      coin:_.inc(reward)
    }
  })
  .then(res => {
      console.log("围观用户分的金币成功")
  })
  .catch(err => {
    console.log("围观用户分的金币失败");
      console.log(err);
  })

  let tip = db.collection('tip');
  for(let i=0;i<supervisor.length;i++){
    let data = {
      //接受用户的openid
      receiver: supervisor[i],
      title: "围观收入",
      content: "您围观的任务失败，分得 " +reward+" 金币",
      time: new Date()
    }
    await tip.add({
      data: data
    })
    .then(res => {
      console.log("插入提醒表成功")
    })
    .catch(err => {
      console.log("插入提醒表失败");
      console.log(err);
    })
  }
}