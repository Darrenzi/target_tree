// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //围观目标
  let targetId = event.targetId;
  let watchUserId = event.watchUserId;
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('target').doc(targetId)
  .update({
    data:{
      supervisor:_.push(watchUserId)
    }
  })
}