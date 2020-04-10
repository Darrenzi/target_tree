// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
exports.main = async (event, context) => {
      // 添加await关键字 
    return await db.collection("friend").aggregate()
        .lookup({
          from: "user",
          localField: "user2_id",
          foreignField: "_openid",
          as: "friendList"
      })
      .end()
        
    }

    



// 根据openid获得friend中的user2_id,再根据user2_id获取user表中对应的un
//  const Openid = cloud.getWXContext().OPENID
//   res:await db.collection("friend")
//   .where({user1_id:Openid})
//   .get()
//   return {
//      res
//   }