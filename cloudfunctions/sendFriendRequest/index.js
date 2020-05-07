// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 console.log(event.friendName)
 const db = cloud.database();
  const _ = db.command;
  let friendName=event.friendName
  try {
    return await db.collection('user')
    .where({
      un:_.eq(friendName)
    })
    .get()
  } catch (e) {
    console.error("err",e)
  }
  // collectio
}