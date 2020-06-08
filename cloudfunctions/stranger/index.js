
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _=db.command

exports.main = async (event, context) => {
  const userId = cloud.getWXContext().OPENID
  try {
    return await db.collection('user').where({
      _openid: _.neq(userId)
    }).get({
      success: function(res) {
        console.log(res.data)
      }
    })
  } catch (e) {
    console.error(e)
  }
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结
}
