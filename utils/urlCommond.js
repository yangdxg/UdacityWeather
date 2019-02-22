

var key = ''
/**
 * 热门城市
 */
var hotCity = 'https://search.heweather.net/top?group=cn&key='+key
/**
 * 城市搜索
 */
var searchCity = 'https://search.heweather.net/find?group=cn&key=' + key
/**
 * 获取生活指数
 */
var lifestyle = 'https://api.heweather.net/s6/weather/lifestyle?group=cn&key=' + key
module.exports = {
  hotCity: hotCity,
  searchCity: searchCity,
  lifestyle: lifestyle
}