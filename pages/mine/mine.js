// pages/mine/mine.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    added:'',
    logged: false,
    showView: false,
    takeSession: false,
    requestResult: '',
    openid:'',
    user_carnum:'',
    user_name:''
  },

  // 用户登录示例
  login: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    let that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功');
  
          that.setData({
            userInfo: result,
            logged: true,
            showView: true,
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
             
              util.showSuccess('登录成功')

              that.setData({
                userInfo: result.data.data,
                logged: true,
                showView: true,
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  onLoad: function (e) {


  },
  bindGetUserInfo: function (e) {
    if (this.data.logged) return;

    util.showBusy('正在登录');

    var that = this;
    var userInfo = e.detail.userInfo;
    

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {

          // 检查登录是否过期
          wx.checkSession({
            success: function (result) {
              // 登录态未过期
         

              util.showSuccess('登录成功');

              that.searchUserCar();
              console.log('wx.getSetting')
              that.setData({
                userInfo: userInfo,
                logged: true,
                showView: true
              })






            },

            fail: function () {
              qcloud.clearSession();
              // 登录态已过期，需重新登录
              var options = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                userInfo: userInfo
              }
              that.doLogin(options);
            },
          });
        } else {
          util.showModel('用户未授权', e.detail.errMsg);
        }
      }
    });
  
  },
// getInfo:function(openid,user_name){
//   let that = this;  
//   wx.getStorage({
//     key: 'uinfo',
//     success: function (res) {
//       console.log('get openid ok')
//       that.setData({
//         openid: res.data.userinfo.openId,
//         user_name: res.data.userinfo.nickName
//       })
     
//     },

//   })


 

//   },

  // postData:function(openid,user_name){
  // var that=this;
  // wx.request({

  //   url: config.service.addUserUrl,
  //   method: 'POST',
  //   data: {
       
  //     openid: that.data.openid,

  //   },
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded'
  //   }, success: function (res) {
    
  //     console.log('update is success')

  //   }

  // })


  // },
  searchUserCar: function (openid){
var that =this
 
  wx.getStorage({
    key: 'uinfo',
    success: function (res) {
      console.log('get openid ok')
      that.setData({
        openid: res.data.userinfo.openId,
        })

      wx.request({

        url: config.service.searchUserCar,
        method: 'POST',
        data: {
          openid: that.data.openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, success: function (res) {
if(res){

          wx.setStorage({
            key: 'userCarInfo',
            data: {'user_carnum':res.data.data }
          })
          that.setData({
            showView: false,
            added: true,
            user_carnum: res.data.data
          })
}
else{

that.setData({
  showView: true, 
  added:false

})

}


        }

      })



    },

  })



  },

  doLogin: function (options) {
    var that = this;
    
    wx.login({
      success: function (loginResult) {
        var loginParams = {
          code: loginResult.code,
          encryptedData: options.encryptedData,
          iv: options.iv,
        }
        qcloud.requestLogin({
          loginParams,
           success(result) {
            util.showSuccess('登录成功');
         console.log(that.data.openid)
        
         that.searchUserCar();
         console.log('wx.login')
            that.setData({
              userInfo: options.userInfo,
              logged: true,
              showView: true,
            })
        



          
       
          },
          fail(error) {
            util.showModel('登录失败', error)
            console.log('登录失败', error)
          }
        });

     



      },
      fail: function (loginError) {
        util.showModel('登录失败', loginError)
        console.log('登录失败', loginError)
      },
    })



  }, 
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

 

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
