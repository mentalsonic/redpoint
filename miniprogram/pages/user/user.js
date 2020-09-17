const userRef= wx.cloud.database().collection('user')
const postRef= wx.cloud.database().collection('post')
Page({
  data: {
    owner: null,
    count: [0,0,0,0,0],
    tags:['野攀行程 Trip','活动 Event','交换装备 Gear exchange','找搭档 Partner','其他 Other']
  },
  async onLoad(option){
    const _openid = option._openid
    await this.getUser(_openid)
    await this.getCount(_openid)
  },
  getUser(_openid){
    try {
      wx.showLoading()
      userRef
      .where({_openid})
      .get()
      .then(res=>{
        this.setData({
          owner: {
            ...res.data[0]
          }
        })
        wx.hideLoading()
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '加载错误',
        icon: 'none'
      })
    }
  },
  async getCount(_openid){
    try {
      const count = await Promise.all(
        this.data.tags.map(async tag=>{
          const n =  await postRef
          .where({_openid,type:tag})
          .count()
          return n.total
        })
      ) 
      this.setData({count})
    } catch (error) {
      console.log(error);
    }
  },
  goToMy(e){
    const idx= e.currentTarget.dataset.idx
    const openId = this.data.owner._openid
    wx.navigateTo({
      url: `/pages/my/my?openId=${openId}&idx=${idx}`,
    })
  }
})