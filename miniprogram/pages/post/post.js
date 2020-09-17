const db = wx.cloud.database()
Page({
  async onLoad(options) {
    const {_id,_openid}=options
    await this.getPost(_id)
    await this.getOwner(_openid)
  },
  getPost(_id){
    db.collection('post')
    .doc(_id)
    .get()
    .then(res=>{
      this.setData({
        ...res.data
      })
    })
    .catch(err=>console.log(err))
  },
  getOwner(_openid){
    db.collection('user')
    .where({_openid})
    .get()
    .then(res=>{
      this.setData({
        owner:res.data[0]
      })
    })
    .catch(err=>console.log(err))
  },
  toOwner(){
    wx.navigateTo({
      url: '/pages/user/user?_openid='+this.data._openid
    })
  }
})