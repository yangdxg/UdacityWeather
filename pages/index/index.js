var urlCommond = require('../../utils/urlCommond.js')
var util = require('../../utils/util.js')

/**
 * 天气英文到中文的映射
 */
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
/**
 * 根据天气映射的颜色
 */
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前所在城市信息
    location: {},
    //空气状况
    air_now_city: {},
    //逐小时天气
    hourly: [],
    //七天内天气情况
    daily_forecast: [],
    //生活指数
    lifestyle: [],
    //生活指数所处index
    lifeswiperpage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.data.location.length)
    let that = this
    wx.getLocation({
      success: function(res) {
        //获取位置信息成功
        that.latToCity(res.longitude, res.latitude)
      },
      fail: function(res) {
        //获取位置信息失败,跳转到城市选择界面
        wx.navigateTo({
          url: '/pages/location/location',
        })
      }
    })
  },

  /**
   * 点击获取当前位置
   */
  onTapLocation() {
    wx.navigateTo({
      url: '/pages/location/location',
    })
  },
  /**
   * 当前页面所有的网络请求
   */
  getData() {
    this.getNowWeather()
    this.getAir()
    this.getforecast()
    this.geThourWeather()
    this.getLifeStyle()
  },
  /**
   * 获取当前的实况天气
   */
  getNowWeather() {
    let that = this
    wx.request({
      url: urlCommond.now + '&location=' + this.data.location.location,
      success(res) {
        let now = res.data.HeWeather6[0].now
        now.cond_code = parseInt(now.cond_code)
        if (now.cond_code == 100) {
          //晴天
          now.image_bg = '/images/sunny-bg.png'
        } else if (now.cond_code > 100 && now.cond_code < 105) {
          //多云
          now.image_bg = '/images/overcast-bg.png'
        } else if (now.cond_code >= 200 && now.cond_code <= 213) {
          //风
          now.image_bg = '/images/cloudy-bg.png'
        } else if (now.cond_code >= 300 && now.cond_code <= 305) {
          //小雨
          now.image_bg = '/images/lightrain-bg.png'
        } else if (now.cond_code >= 306 && now.cond_code <= 399) {
          //大雨
          now.image_bg = '/images/heavyrain-bg.png'
        } else if (now.cond_code >= 400 && now.cond_code <= 499) {
          //雪
          now.image_bg = '/images/snow-bg.png'
        } else {
          //雾
          now.image_bg = '/images/heavyrain-bg.png'
        }
        that.setData({
          now: now
        })
      },
      fail(res) {}
    })
  },
  /**
   * 获取空气质量
   */
  getAir() {
    let that = this
    wx.request({
      url: urlCommond.air + '&location=' + this.data.location.location,
      success(res) {
        console.log(res)
        let air_now_city = res.data.HeWeather6[0].air_now_city
        that.setData({
          air_now_city: air_now_city
        })
      },
      fail(res) {}
    })
  },
  /**
   * 获取近几天内的天气预报
   */
  getforecast() {
    let that = this
    wx.request({
      url: urlCommond.forecast + '&location=' + this.data.location.location,
      success(res) {
        let daily_forecast = res.data.HeWeather6[0].daily_forecast
        for (let i = 0; i < daily_forecast.length; i++) {
          if (i == 0) {
            daily_forecast[i].date = '今天'
          } else if (i == 1) {
            daily_forecast[i].date = '明天'
          } else if (i == 2) {
            daily_forecast[i].date = '后天'
          } else {
            let date = util.getWeek(daily_forecast[i].date)
            daily_forecast[i].date = date
          }
          daily_forecast[i].cond_code_d = '/images/' + daily_forecast[i].cond_code_d + '.png'
        }
        that.setData({
          daily_forecast: daily_forecast
        })
      },
      fail(res) {}
    })
  },
  /**
   * 获取逐小时天气预报
   */
  geThourWeather() {
    let that = this
    wx.request({
      url: urlCommond.hourWeather + '&location=' + this.data.location.lon + "," + this.data.location.lat,
      success(res) {
        let hourly = res.data.HeWeather6[0].hourly
        for (let i = 0; i < hourly.length; i++) {
          let time = util.getTime(hourly[i].time)
          hourly[i].time = time
          hourly[i].iconPath = '/images/' + hourly[i].cond_code + '.png'
        }
        that.setData({
          hourly: hourly
        })
      },
      fail(res) {}
    })
  },
  /**
   * 获取生活指数
   */
  getLifeStyle() {
    let that = this
    wx.request({
      url: urlCommond.lifestyle + '&location=' + this.data.location.location,
      success(res) {
        let lifestyle = res.data.HeWeather6[0].lifestyle
        lifestyle = that.matchLifeText(lifestyle)
        that.setData({
          lifestyle: lifestyle
        })
      },
      fail(res) {}
    })
  },

  /**
   * 匹配生活指数到文字描述
   */
  matchLifeText(lifestyle) {
    let newlifestyle = []
    for (let life in lifestyle) {
      life = lifestyle[life]
      if (life.type == 'comf') {
        life.type = '舒适度'
        life.image = '/images/icon-comf.png'
      } else if (life.type == 'cw') {
        life.type = '洗车'
        life.image = '/images/icon-cw.png'
      } else if (life.type == 'drsg') {
        life.type = '穿衣'
        life.image = '/images/icon-drsg.png'
      } else if (life.type == 'flu') {
        life.type = '感冒'
        life.image = '/images/icon-flu.png'
      } else if (life.type == 'sport') {
        life.type = '运动'
        life.image = '/images/icon-sport.png'
      } else if (life.type == 'trav') {
        life.type = '旅游'
        life.image = '/images/icon-trav.png'
      } else if (life.type == 'uv') {
        life.type = '紫外线'
        life.image = '/images/icon-uv.png'
      } else if (life.type == 'air') {
        life.type = '空气污染扩散条件'
        life.image = '/images/icon-air.png'
      } else if (life.type == 'ac') {
        life.type = '空调开启'
        life.image = '/images/icon-ac.png'
      } else if (life.type == 'ag') {
        life.type = '过敏'
        life.image = '/images/icon-ag.png'
      } else if (life.type == 'gl') {
        life.type = '太阳镜'
        life.image = '/images/icon-gl.png'
      } else if (life.type == 'mu') {
        life.type = '化妆'
        life.image = '/images/icon-mu.png'
      } else if (life.type == 'airc') {
        life.type = '晾晒'
        life.image = '/images/icon-airc.png'
      } else if (life.type == 'ptfc') {
        life.type = '交通'
        life.image = '/images/icon-ptfc.png'
      } else if (life.type == 'fsh') {
        life.type = '钓鱼'
        life.image = '/images/icon-fsh.png'
      } else if (life.type == 'spi') {
        life.type = '防晒'
        life.image = '/images/icon-spi.png'
      }
      newlifestyle.push(life)
    }
    return newlifestyle
  },
  /**
   * 点击生活指数
   */
  lifeItemClick(e) {
    let life = e.currentTarget.dataset.life
    wx.showModal({
      title: life.type + '指数',
      content: life.txt,
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  /**
   * 生活指数页面变化
   */
  lifepagechange(e) {
    this.setData({
      lifeswiperpage: e.detail.current
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
        that.setData({
          location: res.data.HeWeather6[0].basic[0]
        })
        that.getData()
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

})