import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({
  login(e){
    const userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name:"login",
      data: {userInfo}
    }).then(res=>{
      const openId = res.result
      userInfo.openId = openId
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.userInfo=userInfo
    })
    .then(()=>{
      wx.navigateBack({
        delta: 0,
      })
    })
    .catch(err=>{
      console.log(err)
      Toast.fail('Error logging in, try later. Or report issue.')
    })
  }
})