var key = ''
/**
 * 热门城市
 */
var hotCity = 'https://search.heweather.net/top?group=cn&key=' + key
/**
 * 城市搜索
 */
var searchCity = 'https://search.heweather.net/find?group=cn&key=' + key
/**
 * 获取生活指数
 */
var lifestyle = 'https://api.heweather.net/s6/weather/lifestyle?group=cn&key=' + key
/**
 * 逐小时天气预报
 */
var hourWeather = 'https://api.heweather.net/s6/weather/hourly?key=' + key
/**
 * 近几天内的天气预报
 */
var forecast = 'https://free-api.heweather.net/s6/weather/forecast?key='+key
/**
 * 获取当前实况天气
 */
var now = 'https://free-api.heweather.net/s6/weather/now?key='+key
/**
 * 获取空气质量
 */
var air = 'https://api.heweather.net/s6/air?key='+key
module.exports = {
  hotCity: hotCity,
  searchCity: searchCity,
  lifestyle: lifestyle,
  hourWeather: hourWeather,
  forecast: forecast,
  now: now,
  air: air
}