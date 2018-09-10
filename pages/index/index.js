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
    nowTemp: '14°',
    nowWeather: '阴天',
    nowWeatherBackground: '',
    hourlyWeather:"[]",
    todayDate:'',
    todayTemp:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getNow()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      //完成后停止刷新
      complete: () => {
        //callback不为空的情况下执行callback
        callback && callback()
      }
    })
  },
  // 设置当前时间
  setNow(result){
    // 气温
    let temp = result.now.temp
    // 天气
    let weather = result.now.weather
    this.setData({
      nowTemp: temp + "°",
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  // 设置未来时间
  setHourlyWeather(result){
    // 气温天气列表
    let forecast = result.forecast
    // 获取当前时刻
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    // 从当前时间起,每三小时
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (nowHour + i * 3) % 24 + "时",
        iconPath: "/images/" + forecast[i].weather + "-icon.png",
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = "现在"
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`+" 今天"
    })
  },

  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})