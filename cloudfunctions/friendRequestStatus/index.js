// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //修改好友请求的处理状态
  let status = event.status;
  //记录的id
  let id = event.id;
  const db = cloud.database();
  return await db.collection('friendRequest').doc(id)
  .update({
    data:{
      status:status
    }
  })
}