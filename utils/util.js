const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getTime(str) {
  let split = str.split(' ')
  return split[1]
}

function getWeek(str) {
  let date = new Date(str)
  let week = date.getDay()
  if (week == 1) {
    return '星期一'
  } else if (week == 2) {
    return '星期二'
  } else if (week == 3) {
    return '星期三'
  } else if (week == 4) {
    return '星期四'
  } else if (week == 5) {
    return '星期五'
  } else if (week == 6) {
    return '星期六'
  } else if (week == 0) {
    return '星期日'
  }
  return ''
}

module.exports = {
  formatTime: formatTime,
  getTime: getTime,
  getWeek: getWeek
}