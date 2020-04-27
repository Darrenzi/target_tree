// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //根据点赞用户的id 及 目标id删除点赞记录
  let userId = event.userId;
  let targetId = event.targetId;
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('like').where({
    _openid: _.eq(userId),
    target_id: _.eq(targetId)
  })
  .remove()
}