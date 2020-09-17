const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
const ref = db.collection("post")
// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const {formType,formData,open} = event
  try {
    return await ref.add({
      data: {
        formType,
        ...formData,
        open,
        openId
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}