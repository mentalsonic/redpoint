Component({

  properties: {
    selectedType: String
  },

  data: {
    types: [
      { text: '所有 All', value: '所有 All' },
      { text: '野攀行程 Trip', value: '野攀行程 Trip' },
      { text: '活动 Event', value: '活动 Event' },
      { text: '交换装备 Gear exchange', value: '交换装备 Gear exchange' },
      { text: '找搭档 Partner', value: '找搭档 Partner' },
      { text: '其他 Other', value: '其他 Other' },
    ]
  },

  methods: {
    changeType(e){
      this.triggerEvent('changeType',e.detail)
    }
  }
})
