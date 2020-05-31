const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 console.log(event.friendName)
 const db = cloud.database();
  const _ = db.command;
  const wxContext = cloud.getWXContext();
  let userId = wxContext.OPENID;
  let curCoin=event.curCoin
  console.log("curCoin",curCoin)
  try {
    return   await db.collection('user')
    .where({
      _openid:_.eq(userId)
    })
    .update({
      data:{
        coin:curCoin
      }
    })
  } catch (e) {
    console.error("err",e)
  }
  
}