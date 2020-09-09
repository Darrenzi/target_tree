// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('comment').aggregate()
    .match({
      target_id: _.eq(event.targetId)
    })
    .sort({
      time: -1
    })
    .lookup({
      from: 'user',
      localField: '_openid',
      foreignField: '_openid',
      as: 'comment_user'
    })
    .end();
}