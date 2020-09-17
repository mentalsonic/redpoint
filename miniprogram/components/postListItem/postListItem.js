Component({
  properties: {
    post: Object
  },
  methods: {
    toPostDetail(){
      const {_id,_openid} = this.data.post
      wx.navigateTo({
        url: `/pages/post/post?_id=${_id}&_openid=${_openid}`,
      })
    }
  }
})
