
//                     year       month    date
var RE_DATE = /^([+-]?\d{4,6})\-(\d\d)\-(\d\d)$/
var RE_TIME = /^(\d\d):(\d\d)(?::(\d\d))?$/;
var RE_WEEK = /^([+-]?\d{4,6})-W(\d\d)(?:-?(\d))?$/;
var RE_DATETIME = /^([+-]?\d{4,6})\-(\d\d)\-(\d\d)[T ](\d\d):(\d\d)(?::(\d\d))?(?:[+-]\d\d:\d\d)?Z?$/;

var RE_DATES = /^(\d{4,6})\-(\d{1,2})\-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2}):(\d{1,2})(?:[+-]\d{1,2}:\d{1,2})?Z?)?$/;


// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/

function toInt(string) {
  return parseInt(string, 10)
}

function fixWeekday(weekday){
  return weekday === 0 ? 7 : weekday
}

function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 && year % 400 === 0;
}

var MONTH_DATES = [31, 28, 31, 30, 31, 30, 30, 31, 30, 31, 30, 31]
// 计算指定年份所在月的天数
function getDaysOfMonth(year, month){
  return MONTH_DATES[month] + (month === 1 && isLeapYear(year) ? 1 : 0)
}

// 计算指定年份第 week 周的周一 0 时的时间。
function getDateOfWeek(year, week, weekday) {
  var dow = new Date(year, 0, 1).getDay()
  var dates = 1 + (week - 1) * 7
  if (1 <= dow && dow <= 4) {
    dates -= dow - 1
  } else {
    dates += 8 - dow
  }
  return new Date(year, 0, dates + (weekday || 1) - 1)
}

// 计算指定年份拥有的周数
// 第 1 周的周四，第 53 周的周四
function getWeeksOfYear(year) {
  var firstWeek = getDateOfWeek(year, 1, 4)
  var lastWeek = getDateOfWeek(year, 53, 4)
  return 52 +
    (firstWeek.getFullYear() !== year ? 1 : 0) +
    (lastWeek.getFullYear() === year ? 1 : 0)
}

function parseDate(string) {
  var match
  var year = 1900
  var month = 0
  var date = 1
  var hours = 0
  var minutes = 0
  var seconds = 0
  var milliseconds = 0

  if (match = RE_DATE.exec(string)) {

    year = toInt(match[1])
    month = toInt(match[2]) - 1
    date = toInt(match[3])

  } else if (match = RE_TIME.exec(string)) {

    hours = toInt(match[1])
    minutes = toInt(match[2])
    seconds = toInt(match[3]) || 0

  } else if (match = RE_WEEK.exec(string)) {

    var y = toInt(match[1])
    var w = toInt(match[2])
    var day = toInt(match[3])
    var maxWeeks = getWeeksOfYear(y)
    if (w > maxWeeks) {
      return NaN
    }
    var d = getDateOfWeek(y, w, day)
    year = d.getFullYear()
    month = d.getMonth()
    date = d.getDate()

  } else if (match = RE_DATETIME.exec(string)) {

    year = toInt(match[1])
    month = toInt(match[2]) - 1
    date = toInt(match[3])
    hours = toInt(match[4])
    minutes = toInt(match[5])
    seconds = toInt(match[6]) || 0
    milliseconds = toInt(match[7]) || 0

  } else {

    return NaN

  }

  if (0 > month || month > 11 ||
      1 > date || date > getDaysOfMonth(year, month) ||
      0 > hours || hours > 23 ||
      0 > minutes || minutes > 59 ||
      0 > seconds || seconds > 59 ||
      0 > milliseconds || milliseconds > 999
      ) {

    return NaN
  }

  var dt = new Date(1900, month, date, hours, minutes, seconds, milliseconds)
  dt.setFullYear(year)

  return dt
}

function compareDate(stringA, stringB) {
  var dateA = parseDate(stringA)
  var dateB = parseDate(stringB)
  if (isNaN(dateA) || isNaN(dateB)) {throw new Error('Invalid Date'); }
  return dateA.getTime() - dateB.getTime()
}

function verifyIsDate(string) {
  var match = string.match(RE_DATE)
  return match && !isNaN(
      new Date(
        match[1], // year.
        parseInt(match[2], 10) - 1, // month.
        match[3] // date
      ))
}

function verifyIsDateTime(string){
  var match = string.match(RE_DATETIME)
  return match && !isNaN(
      new Date(
        match[1], // year.
        parseInt(match[2], 10) - 1, // month.
        match[3], // date.
        match[4], // hours.
        match[5], // minutes.
        match[6]  // seconds.
      ))
}

exports.getDateOfWeek = getDateOfWeek
exports.parseDate = parseDate
exports.getWeeksOfYear = getWeeksOfYear
