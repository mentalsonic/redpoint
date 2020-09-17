const ref= wx.cloud.database().collection('post')
Page({
  data: {
    userInfo: null,
    count: [0,0,0,0,0],
    tags:['野攀行程 Trip','活动 Event','交换装备 Gear exchange','找搭档 Partner','其他 Other']
  },
  async onShow(){
    // get user
    await this.setData({
      userInfo:getApp().getUser()
    })
    // load trip and gear exchange number
    if (this.data.userInfo){
      try {
        const count = await Promise.all(
          this.data.tags.map(async tag=>{
            const n =  await ref
            .where({_openid:this.data.userInfo.openId,type:tag})
            .count()
            return n.total
          })
        ) 
        this.setData({count})
      } catch (error) {
        console.log(error);
      }
    }
  },
  toLoginPage(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  goToMy(e){
    const idx= e.currentTarget.dataset.idx
    const openId = this.data.userInfo.openId
    wx.navigateTo({
      url: `/pages/my/my?openId=${openId}&idx=${idx}`,
    })
  },
  logout(){
    delete getApp().globalData.userInfo
    wx.clearStorageSync("userInfo")
    this.onShow()
    this.setData({
      count: [0,0,0,0,0]
    })
  }
})