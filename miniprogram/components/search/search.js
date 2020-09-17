Component({
  methods: {
    onSearch(e){
      this.triggerEvent("onSearch",e.detail.trim())
    },
    onNoKeyword(e){
      if (e.detail.trim()===""){
        this.triggerEvent("onNoKeyword")
      }
    }
  }
})
