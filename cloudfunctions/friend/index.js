// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const userOpenid=cloud.getWXContext().OPENID
  return await db.collection('friend').aggregate()
    .match(
      {
        sender:_.eq(userOpenid)
      }
  )
    .lookup({
      from: 'user',
      localField: '_openid',
      foreignField: '_openid',
      as: 'friendList'
    })
    .end();
    

}