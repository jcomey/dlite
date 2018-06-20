// pages/moveCar/moveCar.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    Phone: null,
    imgUrl: '',
    userPhone: '',
    showView: false,
    totalNum: '',
    author: '',
    carnum: '',
    user_carnum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */


  inputCarnum: function (e) {

    this.setData({
      user_carnum: e.detail.value

    })

  },
  onLoad: function () {
    var that = this;
    wx.request({
      method: 'get',
      url: config.service.author,
      success: function (res) {

        that.setData({
          author: res.data.data

        })

      }
    })

    // wx.request({
    //   url: config.service.chartUrl,
    //   data: {},
    //   method: "GET",
    //   header: { 'content-type': 'application/json' },
    //   success: function (res) {
    //     // console.log(res.data)
    //     that.setData({
    //       totalNum: res.data.total
    //     })
    //   }
    // })
  },
  doSearch: function (options) {

    var that = this;
    if (that.data.user_carnum.length != 0) {
      wx.showToast({
        title: '正在努力查找',
        icon: 'loading',
        duration: 10000
      }),


        wx.request({

          url: config.service.searchUrl,
          data: { user_carnum: that.data.user_carnum },
          method: 'post',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 0) {
              console.log(res.data);
              util.showSuccess('请求成功完成')
              let userPhone = res.data.data;
              that.setData({
                Phone: userPhone + '拨打电话',
                showView: true
              })
              wx.hideToast()
            }
            else {
              wx.showToast({
                title: '未找到数据',
                icon: 'none'
              })
              that.setData({
                showView: false
              })
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        })
    }
    else {
      wx.showModal({
        title: '请输入查询车牌号',
        content: '',
      })
    }


  },
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })



            wx.request({
              method: 'post',

              url: 'https://recognition.image.myqcloud.com/ocr/plate',
              header: {
                'content-type': 'application/json',
                'authorization': that.data.author
              },

              data: { appid: '1251006975', url: res.data.imgUrl },
              success: function (res) {
                if (res.data.code == 0) {
                  that.setData({
                    user_carnum: res.data.data.items[0].itemstring


                  })
                  that.doSearch();
                }
                else {

                  wx.showModal({
                    title: '数据异常',
                    content: res.data.message,
                  })

                }


              }

            })





          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  formSubmit: function (e) {

    this.doSearch();



    // wx.request({
    //   url: config.service.message,
    //   data: {
    //     'input':user_carnum,
    //     'formId': e.detail.formId,
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     // success
    //     console.log('成功' + res);
    //     // console.log(e.detail.formId);
    //   },
    //   fail: function (err) {
    //     // fail
    //     console.log('失败' + err);
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })





  },


  makeCall: function (e) {

    wx.makePhoneCall({
      phoneNumber: this.data.Phone,
    })
  },

  addMyCar: function (logged) {
    console.log(this.data.logged)


  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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