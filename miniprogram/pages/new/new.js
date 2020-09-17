const app = getApp()

Page({
  data: {
    types: ["野攀行程 Trip","活动 Event","交换装备 Gear exchange","找搭档 Partner","其他 Other"],
    show: false,
    type:"野攀行程 Trip"
  },
  async onShow(){
    // if not logged in, navitate to login
    await !app.getUser() && wx.navigateTo({url: '/pages/login/login' })
    // if not type, modal show
    !this.data.type && this.showPopup()
  },
  showPopup() {
    this.setData({ show: true });
  },
  onCancel() {
    this.setData({ show: false });
  },
  async onConfirm(e) {
    const {value} = e.detail;
    await this.setData({type:value})
    this.onCancel()
  },
})