// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('like').aggregate()
    .match({
      target_id: _.in(event.user_targets)
    })
    .sort({
      time: -1
    })
    .lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_openid',
      as: 'like_user'
    })
    .end();
}