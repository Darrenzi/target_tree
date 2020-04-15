// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _=db.command
exports.main = async (event, context) => {
  
    return await db.collection('user').orderBy('coin', 'desc')
    .get({
      success:function(res){
        console.log(res.data)
      }
    })
    .then(console.log)
  .catch(console.error)

}
