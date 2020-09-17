Component({
  properties: {
    value:String
  },
  methods: {
    copy(){
      wx.setClipboardData({
        data: this.properties.value,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) 
            }
          })
        }
      })
    }
  }
})
