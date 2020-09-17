const ref = wx.cloud.database().collection("post")
Page({
  data: {
    tags:['野攀行程 Trip','活动 Event','交换装备 Gear exchange','找搭档 Partner','其他 Other'],
    active: 0,
    activeTab: '',
    owner:"",
    show: false,
    _id: "",
    tabList:[]
  },
  onLoad(options) {
    const {openId,idx}=options
    this.setData({
      active:parseInt(idx),
      activeTab: this.data.tags[parseInt(idx)],
      owner:openId
    })
  },
  // onShow: function () {
  //   this.selectComponent("#myPostList").onShow()
  // },
  onPullDownRefresh: function () {
    this.selectComponent("#myPostList").onPullDownRefresh()
  },
  onReachBottom: function () {
    this.selectComponent("#myPostList").onReachBottom()
  },
switchTab(e){
  this.setData({
    activeTab: e.detail.title
  })
},
  async showForm(e){
    const _id = e.detail
    await this.setData({_id})
    this.setData({show:true})
  },
  onClose() {
    this.setData({ show: false });
  },
})