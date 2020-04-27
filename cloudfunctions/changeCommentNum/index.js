// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let targetId = event.targetId;
  console.log(targetId);
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('target').doc(targetId)
  .update({
    data:{
      comment: _.inc(1)
    }
  })
}