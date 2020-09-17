const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
const ref = db.collection("user")

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  try {
    const res = await ref.where({_openid}).get()
    if (res.data.length===0) {
      await ref.add({
        data:{
          ...event.userInfo,
          _openid,
          contact:{
            wechat:"",
            email:"",
            mobile:""
          },
          ts: Date.now()
        }
      })
    }
    return _openid
  } catch (error) {
    console.log(error)
  }
}