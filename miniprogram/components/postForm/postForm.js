const areaList = require("../../area.js").default
const db = wx.cloud.database()
const postRef = db.collection("post")
const userRef = db.collection("user")

Component({
  properties:{
    type:String,
    _id: { 
      type: String,
      observer: function(newVal){
        postRef.doc(newVal)
        .field({
          _id:0,
          subject: 1,
          location:1,
          exp:1,
          desc:1,
          files:1
        })
        .get()
        .then(async res=>{
          await this.setData({
            formData:res.data,
            isUpdate:true
          })
          if (this.data.formData.files && this.data.formData.files.length>0){
            this.getFiles(this.data.formData.files)
          }
        })},
  },
  },
  data: {
    openId:"",
    isUpdate:false,
    fileList: [],
    formData:null,
    contact:{
      wechat:"",
      email:"",
      mobile:""
    },
    areaShow:false,
    calendarShow:false,
    areaList: areaList
  },
  lifetimes: {
    attached: function() {
      this.getContact()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    getContact(){
      const openId = getApp().getUser().openId
      userRef.where({
        _openid:openId
      }).get().then(res=>{
        this.setData({
          contact:res.data[0].contact,
          openId
        })
      }).catch(err=>{
        wx.showToast({
          title: 'Error loading contact',
          icon: 'none'
        })
      })
    },
    getFiles(fileIDs){
        wx.cloud.getTempFileURL({
          fileList: fileIDs,
          success: res => {
            const fileList = res.fileList.map (file=>{
              return {
                path : file.tempFileURL, 
                indb:true
              }
            })
            this.setData({fileList})    
          },
          fail: err => {
            // handle error
            console.log(err);
          }
        })
    },
    inputChange(e) {
      const formData = Object.assign({}, this.data.formData)
      formData[e.currentTarget.id] = e.detail
      this.setData({ formData })
    },
    async contactChange(e){
      const {key,value}=e.detail
      const contact = Object.assign({},this.data.contact)
      contact[key]=value
      await this.setData({contact})
      console.log(this.data.contact);
    },
    showCalendar() {
      wx.hideKeyboard({
        complete: () => {
          this.setData({ calendarShow: true })
        }
      })

    },
    hideCalendar() {
      this.setData({ calendarShow: false })
    },
    formatDate(date) {
      date = new Date(date);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m > 9 ? m : "0" + m
      let d = date.getDate();
      d = d > 9 ? d : "0" + d
      return `${y}/${m}/${d}`;
    },
    async onDateConfirm(e) {
      const formData = Object.assign({}, this.data.formData)
      formData.exp = this.formatDate(e.detail)
      await this.setData({
        calendarShow: false,
        formData
      });
    },
    showArea() {
      this.setData({ areaShow: true })
    },
    hideArea() {
      this.setData({ areaShow: false })
    },
    areaConfirm(e){      
      const formData = Object.assign({}, this.data.formData)
      formData.location = e.detail.values
      this.setData({
        formData,
        areaShow:false
      })
      this.hideArea()
    },
    async afterRead(event) {
      let { file } = event.detail;
      if (file.size > 1024*1024) {
        // console.log("大图");
        wx.compressImage({
          src: file.path, // 图片路径
          quality: 0.2 // 压缩质量
        }).then(res=>{
          file.path=res.tempFilePath
        }) 
      } else {
        // console.log("小图");
      }
      file.indb = false
      const { fileList = [] } = this.data;
      fileList.push({...file});
      await this.setData({ fileList });
    },
    async deleteFile(e){
      let formData = Object.assign({},this.data.formData) 
      let fileList = [...this.data.fileList]
      const i = e.detail.index
      console.log(this.data.fileList);
      if (fileList[i].indb){
        try {
          await wx.cloud.deleteFile({
            fileList: [formData.files[i]]
          })
          formData.files = formData.files.filter((file,idx)=>idx!==i)
        } catch (error) {
          console.log(error);
        }
      }
      fileList = fileList.filter((file,idx)=>idx!==i)
      await this.setData({fileList,formData})
      console.log("files",this.data.formData.files);
      console.log("fileList",this.data.fileList);
    },
    async onSubmit(e){
      const that = this
      // 1. 开始loading
      wx.showLoading()
      try {
      // 2. 检查required
      that.checkRequired()
      // 3. 压缩图片
      // 4. 上传图片
      if (that.data.fileList.length>0) {
        let formData = Object.assign({},this.data.formData)
        let files = formData.files ? formData.files : []
        await this.data.fileList.forEach(async file=>{
          if (!file.indb){
            console.log("new image to upload");
            wx.cloud.uploadFile({
              cloudPath: `${Date.now()*parseInt(Math.random()*100)}.jpg`,
              filePath: file.path,
              success: async res => {
              files.push(res.fileID)
              formData.files = files
              await that.setData({formData})
              if (that.data.formData.files.length===that.data.fileList.length) {
                that.uploadData(e)
              }
              }
            })
          } else{
            if (that.data.formData.files.length===that.data.fileList.length) {
              that.uploadData(e)
            }
          }
        })
      } else {
        that.uploadData(e)
      }
      } catch (error) {
        console.log(error);
        await wx.hideLoading()
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
      }
  },
    checkRequired(){
        const formData = Object.assign({},this.data.formData)
        const {subject,location,desc}=formData
        if (!subject||!location||!desc){
          throw new Error("Required field missing")
        }
    },
    uploadFile(path){
      wx.cloud.uploadFile({
        cloudPath: `${Date.now()*parseInt(Math.random()*100)}.jpg`,
        filePath: path,
        success: res => {
          return res.fileID
        },
        fail: err => {
          throw new Error(err)
        }
      })
    },
    async uploadData(e){
      const open = e.detail.target.id === "post" ? true : false
      console.log(this.data.formData);
      
                    // 6. 上传/更新doc
                    if (this.data.isUpdate) {
                      await postRef.doc(this.properties._id).update({
                        data: {
                          ...this.data.formData,
                          open
                        }
                      })
                    } else {
                      await postRef.add({
                        data: {
                          type: this.properties.type,
                          ...this.data.formData,
                          created: new Date().valueOf(),
                          open
                        }
                      })
                    }
      
                    // 跟新contact
                    await userRef.where({_openid:this.data.openId}).update({
                      data:{
                        contact:this.data.contact
                      }
                    })
      
                    // 7. 清楚表格内容
                    await this.formReset()
      
                    // 8. 关闭loading
                    wx.hideLoading()
      
                    // 9. redirect
                    wx.switchTab({
                        url: '/pages/index/index',
                      })

    },
    formReset() {
      this.setData({
        formData: null,
        date:"",
        fileList:[]
      })
    }
  }
})
