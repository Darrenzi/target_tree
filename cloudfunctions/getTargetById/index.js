// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let targetId = event.targetId;
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('target').aggregate()
  .match({
    _id:_.eq(targetId)
  })
  .lookup({
    from:"user",
    localField:"_openid",
    foreignField:"_openid",
    as:"userList"
  })
  .end();
}