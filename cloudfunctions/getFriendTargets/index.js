// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let userId = event.userId;
  let dateField = event.dateField;
  let firstDayDate = new Date(dateField.firstDay);
  let lastDayDate = new Date(dateField.lastDay);
  const db = cloud.database();
  const _ = db.command;
  const $ = db.command.aggregate;
  let firstDay = $.dateFromString({
    dateString: firstDayDate.toJSON()
  });
  let lastDay = $.dateFromString({
    dateString: lastDayDate.toJSON()
  });
  return await db.collection('target').aggregate()
  .lookup({
      from: "tool",
      localField: "treeId",
      foreignField: "_id",
      as: "tree"
  })
  .sort({
    time:-1
  })
  .addFields({
    firstMatched: $.gt(['$time', firstDay]),
    lastMatched:$.lt(['$time', lastDay])
  })
  .match({
    firstMatched: !0,
    lastMatched:!0,
    _openid: _.eq(userId)
  })
  .end();
}