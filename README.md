# 引言

2020年奥运会将攀岩运动纳入了比赛项目，各个城市的岩馆也有如春笋一般蓬勃发展，中国的攀岩爱好者数量激增。

基于微信聊天群为基础的攀岩信息交流已无法满足与日俱增的需求，RedPoint红点（“红点”在攀岩中的意思为成功爬完一条线路）应运而生。

# 应用场景

发布野攀行程、线下活动、装备交换、寻找搭档等信息。（已完成）

发布各地岩馆、野攀目的地住宿等信息。（待开发）

# 项目名称

RedPoint红点

# 项目简介

RedPoint红点是一款面向攀岩爱好者的小程序，提供了攀岩相关信息的交流平台。

# 目标用户

国内外攀岩爱好者。

# 实现思路

本小程序基于云开发，用到了云数据库存储数据，使用云函数获取当前用户的openid、读写操作云数据库，云存储保存图片。

UI上借助Vant Weapp组件，进行快速开发。

主要用到云开发的一下几个特征功能点：

1. 用户登录获取openid

2. 云数据库CRUD操作

3. 用户上传图片到云存储

# 架构图

![架构图](https://github.com/mentalsonic/RedPoint/blob/master/screenshot/Screen%20Shot%202020-09-17%20at%2011.02.02%20PM.png)

# 效果截图

![截图1](https://github.com/mentalsonic/RedPoint/blob/master/screenshot/Screen%20Shot%202020-09-17%20at%2011.13.26%20PM.png)

![截图2](https://github.com/mentalsonic/RedPoint/blob/master/screenshot/Screen%20Shot%202020-09-17%20at%2011.13.35%20PM.png)

# 功能代码展示

云函数

```js
const cloud = require('wx-server-sdk')
	cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
	const db = cloud.database()
	const ref = db.collection("user")
	

	exports.main = async (event, context) => {
	  const wxContext = cloud.getWXContext()
	  const _openid = wxContext.OPENID
	  try {
	    const res = await ref.where({_openid}).get()
	    if (res.data.length===0) {
	      await ref.add({
	        data:{
	          ...event.userInfo,
	          _openid,
	          contact:{
	            wechat:"",
	            email:"",
	            mobile:""
	          },
	          ts: Date.now()
	        }
	      })
	    }
	    return _openid
	  } catch (error) {
	    console.log(error)
	  }
	}
```

数据库

```js
const db = wx.cloud.database()
const _ = db.command
const LIMIT = 10

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
```








# 作品体验二维码

作品正在上线审核中，稍后更新二维码。

作品代码仓库：https://github.com/mentalsonic/RedPoint

# 团队简介

团队名称：WeClimb

团队成员：任蓓瑛

Github主页：https://github.com/mentalsonic/






# 部署教程


# 开源协议

本项目遵守MIT开源协议