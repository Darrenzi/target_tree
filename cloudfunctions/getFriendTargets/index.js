// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let userId = event.userId;
  console.log(userId);
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('target').aggregate()
  .match({
    _openid:_.eq(userId)
  })
  .lookup({
    from:"tool",
    localField:"treeId",
    foreignField:"_id",
    as:"tree"
  })
  .end();
}