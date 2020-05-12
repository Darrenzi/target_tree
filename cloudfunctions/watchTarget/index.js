// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //围观目标
  let option = event.option;
  let targetId = event.targetId;
  let watchUserId = event.watchUserId;
  console.log(event);
  const db = cloud.database();
  const _ = db.command;
  if(option == "watch"){
    return await db.collection('target').doc(targetId)
      .update({
        data: {
          supervisor: _.push(watchUserId)
        }
      })
  }
  else{
    return await db.collection('target').doc(targetId)
    .update({
      data:{
        supervisor:_.pull(watchUserId)
      }
    })
  }
}