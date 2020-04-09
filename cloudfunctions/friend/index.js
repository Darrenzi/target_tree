// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// exports.main = async (event, context) => {
//   // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
//   return db.collection('friend').where({
//      user1_id:'lqh'
//   }).get()
// }

db.collection('friend').aggregate()
 .lookup({
   from:'user',
   localField:'user2_id',
   foreignField:'_id',
   as:'Friends'
 })
 .end()
 .then(res => console.log(res))
 .catch(err => console.error(err))
