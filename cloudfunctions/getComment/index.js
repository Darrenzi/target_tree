// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//获得所有发送给自己的评论
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const wxContext = cloud.getWXContext();
  let openid = wxContext.OPENID;
  let res = await db.collection('comment').aggregate()
    .match({
      target_id:_.in(event.user_targets),
      _openid:_.neq(openid)
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
    return res;
}