// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //暂未考虑分页
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  const db = cloud.database();
  const _ = db.command;
  return await db.collection('target').aggregate()
  .lookup({
    from: "user",
    localField: "_openid",
    foreignField: "_openid",
    as: "userList"
  })
  .match({
    supervisor: _.all([openid])
  })
  .sort({time:-1})
  .end();
}