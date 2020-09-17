const db = wx.cloud.database()
const _ = db.command
const LIMIT = 10
Component({

  properties: {
    isHome: Boolean,
    owner:String,
    activeTab: {
      type: String,
      observer: async function(newVal){
        await this.setData({
          selectedType:newVal
        })
        this.onShow()
      }
    }
  },

  data: {
      posts:[],
      order: "desc",
      selectedType: "所有 All",
      keyword:'',
      page: 1,
      end:0,
      visitor:''
  },
  ready(){    
    if (getApp().getUser()) {
      this.setData({
        visitor:getApp().getUser().openId
      })
    }
  },
  methods: {
    showForm(e){
      this.triggerEvent("showForm",e.detail)
    },
    async onShow () {
      await this.setData({
        posts:[],
        order: "desc",
        selectedType: this.data.selectedType,
        keyword:'',
        page: 1,
        end:0
      })
      this.getPosts()
    },
    async onReachBottom(){
        await this.setData({page: this.data.page+1})
        this.getPosts()
    },
    onPullDownRefresh(){
      this.onShow()
      wx.stopPullDownRefresh()
    },
    async toggleOrder(){
      const order = this.properties.order === "desc" ? "asc" : "desc"
      await this.setData({
        posts:[],
        order,
        page: 1,
        end:0
      })
      this.getPosts()
    },
    async onSearch(e){
      const keyword = e.detail
      await this.setData({
        keyword,
        posts:[],
        page: 1,
        end:0
      })
      this.getPosts()
    },
    async onNoKeyword(){
      await this.setData({
        keyword:"",
        posts:[],
        page: 1,
        end:0
      })
      this.getPosts()
    },
    async changeType(e){
      await this.setData({
        selectedType:e.detail,
        posts:[],
        page: 1,
        end:0
      })
      this.getPosts()
    },
    getPosts(){
      const SKIP = LIMIT * (this.data.page -1)
      let typeWhere
      if (this.properties.owner){
        typeWhere  = {
          _openid:this.properties.owner
        }
      } else {
        typeWhere  = {
          open: true
        }
      }
      typeWhere  = this.data.selectedType === "所有 All" ? typeWhere : {
        ...typeWhere,
        type: this.data.selectedType
      }
      const exp = db.RegExp({
        regexp: this.data.keyword,
        options: 'i',
        })
      const searchWhere = _.or([
        {
          subject: exp 
        },
        {
          desc: exp 
        },
        {
          type: exp 
        },
        {
          'location.0.name': exp 
        },
        {
          'location.1.name': exp 
        }
      ])
      try {
        wx.showLoading()
        db.collection('post')
        .where(typeWhere)
        .where(searchWhere)
        .limit(LIMIT)
        .skip(SKIP)
        .orderBy('created', this.data.order)
        .field({
          subject:1,
          location:1,
          created:1,
          type:1,
          _openid:1,
          open:1,
          files:1
        })
        .get()
        .then(res=>{          
          wx.hideLoading({
            success: async () => {
              if (res.data.length < LIMIT) {
                await this.setData({end:1})
              }
              await this.setData({
                posts:[...this.data.posts,...res.data]
              })
            }
          })
        })
      } catch (error) {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载失败 Error loading',
              icon: 'none'
            })
          },
        })
      }
    }
  }
})
