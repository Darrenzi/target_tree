// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //获得每日排行榜
  const db = cloud.database();
  let res = await db.collection('user')
  .field({
    _id:false,
    avatarUrl:true,
    _openid:true,
    coin:true
  })
  .orderBy('coin','desc')
  .get()
  .catch(err=>{
    console.log("获取用户表失败");
    console.log(err);
  })
  let rankList = res.data;
  console.log(rankList);
  await db.collection('rank').add({
    data:{
      rankList: rankList,
      time: new Date()
    }
  })
  .then(res => {
    console.log("插入排行榜成功");
  })
  .catch(err => {
    console.log("插入排行榜失败");
    console.log(err);
  })
}