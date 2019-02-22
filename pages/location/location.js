// pages/location/location.js
var urlCommond = require('../../utils/urlCommond.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {
      location: '当前位置'
    },
    myCity: [],
    hotCity: [],
    searchCity: [],
    editMyCity: false,
    inputSearch: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyCity()
    this.getLocation()
    this.getHotCity()
  },
  searchInput(e) {
    let input = e.detail.value
    this.searchCity(input)
  },
  /**
   * 读取本地我的城市信息
   */
  getMyCity() {
    let that = this
    wx.getStorage({
      key: 'mycity',
      success: function(res) {
        that.setData({
          myCity: JSON.parse(res.data)
        })
      },
    })
    this.setData({
      myCity: this.data.myCity
    })
  },
  /**
   * 保存我的城市信息到本地
   */
  saveMyCity() {
    let data = JSON.stringify(this.data.myCity)
    wx.setStorage({
      key: 'mycity',
      data: data,
    })
  },
  /**
   * 获取当前所在城市
   */
  getLocation() {
    let that = this
    wx.getLocation({
      success: function(res) {
        that.latToCity(res.longitude, res.latitude)
      },
      fail(res) {}
    })
  },
  /**
   * 定位当前城市或选中定位的城市
   */
  locationClick() {
    if (this.data.location.location == '当前位置') {
      let that = this
      wx.openSetting({
        success(res) {
          that.getLocation()
        }
      })
    } else {
      let pages = getCurrentPages()
      let prePage = pages[pages.length - 2]
      prePage.setData({
        city: this.data.location
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 点击搜索的城市或点击热门城市
   */
  cityItemClick(e) {
    let selectCity = e.currentTarget.dataset.city
    this.data.myCity.push(selectCity)
    this.setData({
      myCity: this.data.myCity
    })
    this.saveMyCity()
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    prePage.setData({
      city: selectCity
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 获取热门城市列表
   */
  getHotCity() {
    let that = this
    wx.request({
      url: urlCommond.hotCity,
      success(res) {
        that.setData({
          hotCity: res.data.HeWeather6[0].basic
        })
      }
    })
  },
  /**
   * 搜索城市
   */
  searchCity(key) {
    let that = this
    wx.request({
      url: urlCommond.searchCity + '&location=' + key,
      success(res) {
        console.log(res)
        let searchCity = res.data.HeWeather6[0].basic
        if (res.data.HeWeather6[0].basic == undefined) {
          searchCity = []
        }
        console.log(searchCity)
        that.setData({
          searchCity: searchCity
        })
      }
    })
  },
  /**
   * 根据经纬度获取当前城市
   */
  latToCity(long, lat) {
    let that = this
    wx.request({
      url: urlCommond.searchCity + '&location=' + long + ',' + lat,
      success(res) {
        console.log(res)
        that.setData({
          location: res.data.HeWeather6[0].basic[0]
        })
      }
    })
  },
  /**
   * 编辑我的城市
   */
  editClick(e) {
    this.setData({
      editMyCity: !this.data.editMyCity
    })
  },
  /**
   * 删除我的城市
   */
  deleteClick(e) {
    let index = e.currentTarget.dataset.index
    this.data.myCity.pop(index)
    this.setData({
      myCity: this.data.myCity
    })
    this.saveMyCity()
  },
  /**
   * 清除输入框输入
   */
  clearInputClick(e) {
    this.setData({
      inputSearch: ''
    })
  }
})