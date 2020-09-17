App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
  },
  async onShow (){
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      this.globalData.userInfo=userInfo
    }
  },
  getUser(){
    const userInfo = this.globalData.userInfo
    if (!userInfo){
      return null
    } else {
      return userInfo
    }
  }
})
