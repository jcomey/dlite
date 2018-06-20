// pages/usefulTel/usefulTel.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  openid:'',
  getData:'',
  picUrl:'',
  de:''

  },

getInfo:function(){
var that=this;
  wx.getStorage({
    key: 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A',
    success: function (res) {
      that.setData ({
        openid: res.data.userinfo.openId,
      })

      console.log(res.data.userinfo.openId)
    }
    })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that =this;
  var arry = new Array();
  
  wx.request({
    url: config.service.getTell,
    method:'GET',
    header: {  'content-type': 'application/json'},
    success:function(res){
  
    

     
that.setData({

getData:res.data,
 
})
 
 
    }
  })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  telNum:function(e){
    console.log(e.currentTarget.dataset.phone)
wx.makePhoneCall({
  phoneNumber:e.currentTarget.dataset.phone,
})


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})