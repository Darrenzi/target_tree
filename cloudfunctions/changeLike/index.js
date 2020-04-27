// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let operation = event.operation;
  let targetId = event.targetId;
  //点赞用户的id
  let likeUserId = event.userId;
  const db = cloud.database();
  const _ = db.command;
  console.log(operation);
  switch(operation){
    case 'like':{
      //点赞
      return await db.collection('target').doc(targetId)
      .update({
        data:{
          like: _.push(likeUserId)
        }
      })
      break;
    }
    case 'cancel':{
      //取消点赞
      return await db.collection('target').doc(targetId)
      .update({
        data:{
          like: _.pull(likeUserId)
        }
      })
      break;
    }
  }
}