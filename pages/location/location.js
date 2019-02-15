// pages/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      hotCity:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.searchCity()
  },
  searchInput(e) {
  },
  searchCity() {
    let that = this
    wx.request({
      url: 'https://search.heweather.net/top?group=cn&key=2a4cc99ce34148709a2336eea61d824e',
      success (res){
        console.log(res)
        that.setData({
          hotCity: res.data.HeWeather6[0].basic
        })
      }
    })
  }
})