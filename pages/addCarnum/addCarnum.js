// pages/addCarnum/addCarnum.js
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_carnum: '',
    user_phone: '',
    openid: '',
    mycar: '',
    added: false,
    sqlresult: '',
    city: '',
    latitude: '',
    longitude: '',
    added:true,
    i:'',
    multiArray: [["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀",
      "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂",
      "津", "贵", "云", "桂", "琼", "青", "新", "藏",
      "蒙", "宁", "甘", "陕", "闽", "赣", "湘"], ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]],
    select: '',
   
    multiIndex: [0, 0]

  },
  // bindMultiPickerColumnChange: function (e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   var data = {
  //     multiArray: this.data.multiArray,
  //     multiIndex: this.data.multiIndex
  //   };
  //   data.multiIndex[e.detail.column] = e.detail.value;   
  //   this.setData(data);
  //   console.log(data.multiIndex[e.detail.column])
  // },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },

  inputCarnum: function (e) {

    this.setData({
      user_carnum: e.detail.value,
      sqlresult: ''
    })

  },
  inputPhone: function (e) {

    this.setData({
      user_phone: e.detail.value

    })


  },
  addCarnum: function () {
    this.checkNull();

  },
  checkRepeat: function () {

  },
  checkNull: function (user_carnum, user_phone) {
    let formateCarnum = this.data.user_carnum.replace(/\s/g, "");
    let userPhone = this.data.user_phone.replace(/\s/g, "");

    if (formateCarnum.length == 0 || userPhone.length == 0) {

      wx.showModal({
        title: '车牌号或手机号不应为空',
        icon: 'loading',
        duration: 1500
      })


    }
    if (formateCarnum.length < 5 || formateCarnum.length == 0) {
      wx.showModal({
        title: '请查看输入准确的车牌号',
        icon: 'loading',
        duration: 1500
      })
    }
    else if (userPhone.length != 11) {
      wx.showModal({

        title: '请输入11位手机号码!',

        duration: 3500

      })

    }
    else {

      this.formSubmit();
    }

  },

  formSubmit: function (e, user_carnum, user_phone, multiArray, multiIndex, openid) {

    let that = this;

    // console.log(that.data.multiIndex[0])
    var submiteIndex = that.data.multiIndex[0];
    var submiteIndex2 = that.data.multiIndex[1];


    wx.request({
      url: config.service.addCarUrl,
      data: {
        user_carnum: that.data.multiArray[0][submiteIndex] + that.data.multiArray[1][submiteIndex2] + that.data.user_carnum,
        user_phone: that.data.user_phone,
        wx_openid: that.data.openid


      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // PHP需修改此项
      },
      method: 'POST',

      success: function (res) {

        if (res.data.data == 1) {

          wx.showToast({
            title: '添加成功',
            icon: '',
            duration: 1500

          })

        setTimeout(function () {
            let pages = getCurrentPages();//当前页面
            let prevPage = pages[pages.length - 2];//上一页面
            prevPage.setData({//直接给上移页面赋
              added: true,
              showView:false,
              // user_carnum:trehat.data.user_carnum
            });
            wx.navigateBack({//返回
              delta: 1
            })
           
            // wx.redirectTo() ({
            //   url: '/pages/mine/mine?added=true',
            // })  



            console.log('this fun run')
          }, 3000)
        }
        else if (res.data.code == 0) {
          that.setData({
            sqlresult: res.data.data,
            user_carnum: ""
          })
          wx.showToast({
            title: '数据异常',
            icon: 'loading',
            duration: 1500

          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options, provinceDict) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
 
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          
          latitude: res.latitude,
          longitude: res.longitude

        })
        console.log(that.data.latitude)
        wx.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1/",
          method: "post",
          data: {
            location:that.data.latitude+','+that.data.longitude,          
             key:'M35BZ-DYVE5-5NFIV-QZ5OY-VTIUO-JTFKV'
          },
          success: function (res) {
            let currentCity = res.data.result.address_component.city;
            let currentProvince = res.data.result.address_component.province;
            var provinceDict = new Array("北京市", "上海市", "浙江省", "江苏省", "广东省", "山东省", "山西省", "河北省", "河南省", "四川省", "重庆市", "辽宁省", "吉林省", "黑龙江省", "安徽省", "湖北省", "天津市", "贵州省", "云南省", "广西壮族自治区", "海南省", "青海省", "新疆维吾尔自治区", "西藏自治区", "内蒙古自治区", "宁夏回族自治区", "甘肃省", "陕西省", "福建省", "江西省", "湖南省")
                 console.log(currentProvince)
                 for (var i = 0; i < provinceDict.length; i++) {
                   if (provinceDict[i] == currentProvince) {  
                     that.setData({
                       multiIndex: [i, 4]
                     })
                   }
                 }

       

       
          }

        })


      },
    })



    wx.getStorage({
      key: 'uinfo',
      success: function (res) {
wx.request({
  url: config.service.addUserUrl,
})
        var openid = res.data.userinfo.openId;
        that.setData({
          openid: openid
        })
        console.log(that.data.openid);


      },
    })
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