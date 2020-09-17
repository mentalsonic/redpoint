const ref = wx.cloud.database().collection("post")
Component({
  properties: {
    _id: String,
    open: Boolean,
    draft: Boolean,
    files:Array
  },
  methods: {
    onChange(e){
      ref
      .doc(this.properties._id)
      .update({
        data:{
          open: e.detail
        }
      })
      .then(res=>{
        this.triggerEvent("onSwitchOpen")
      })
      .catch(err=>console.log(err))
    },
    onEdit(){
      this.triggerEvent("showForm",this.properties._id)
    },
    onDelete(){
      wx.showModal({
        title: '删除帖子 Deleting post',
        content: '确定要删除吗，数据不可恢复哦～ Are you sure to delete the post?',
        success:async(res)=> {
          if (res.confirm) {
            try {
              // 1. 删除file
              await wx.cloud.deleteFile({
                fileList: this.properties.files
              })
              // 2。 删除post
              await ref.doc(this.properties._id).remove()
              // 刷新
              await this.triggerEvent("onDelete")
            } catch (error) {
              console.log(error);
              wx.showToast({
                title: 'Error deleting post',
                icon:'none'
              })
            }
          }    
        }
    })
  }
}
})
