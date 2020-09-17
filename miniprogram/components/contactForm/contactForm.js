
Component({
  properties:{
    contact:{
      type: Object
    }
  },
  methods: {
    inputChange(e) {
      const detail={
        key: e.currentTarget.id,
        value: e.detail
      }
      this.triggerEvent("inputChange",detail)
    }
  }
})
