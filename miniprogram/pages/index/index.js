
Page({
  onShow: function () {
    this.selectComponent("#homePostList").onShow()
  },
  onPullDownRefresh: function () {
    this.selectComponent("#homePostList").onPullDownRefresh()
  },
  onReachBottom: function () {
    this.selectComponent("#homePostList").onReachBottom()
  },
})