// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let openid = wxContext.OPENID;
  //用户上次拉取的消息的时间
  let lastDate = event.lastDate;

  const db = cloud.database();
  const _ = db.command;
  //获取用户所有任务id
  let res = await db.collection('target').where({
    _openid:_.eq(openid)
  })
  .field({
    _id:true
  })
  .get();
  let targets_id = [];
  for(let i=0;i<res.data.length;i++){
    targets_id.push(res.data[i]._id);
  }

  let lastLikeTime = new Date(lastDate.likeTimeStamp);
  let lastCommentTime = new Date(lastDate.commentTimeStamp);
  let lastTipTime = new Date(lastDate.tipTimeStamp);
  let lastFriendTime = new Date(lastDate.newFriendTimeStamp);

  let newLikeNum = await db.collection('like').where({
    target_id:_.in(targets_id),
    time: _.gt(lastLikeTime)
  }).count();

  let newCommentNum = await db.collection('comment').where({
    target_id:_.in(targets_id),
    time: _.gt(lastCommentTime)
  }).count();

  let newTipNum = await db.collection('tip').where({
    receiver:_.eq(openid),
    time:_.gt(lastTipTime)
  }).count();

  let newFriendNum = await db.collection('friendRequest').where({
    receiver:_.eq(openid),
    time: _.gt(lastFriendTime)
  }).count();

  console.log(newLikeNum, newCommentNum, newTipNum, newFriendNum);
  let allNewNum = newLikeNum.total + newCommentNum.total + newTipNum.total + newFriendNum.total;
  return allNewNum;
}