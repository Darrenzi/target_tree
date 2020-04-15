// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id;
  let tableName = event.tableName
  const db = cloud.database();
  const _ = db.command;
  return await db.collection(tableName).doc(id).remove();
}