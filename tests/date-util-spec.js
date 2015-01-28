var expect = require('expect.js');
var dateUtil = require('../date-util');

function typeOf(type) {
  return function(object) {
    return Object.prototype.toString.call(object) === '[object ' + type + ']'
  }
}
var isArray = typeOf("Array")
var isNumber = typeOf("Number")

function isAbsNaN(object){
  return isNumber(object) && isNaN(object)
}

function each(list, handler) {
  for(var i=0,l=list.length; i<l; i++){
    handler(list[i], i)
  }
}

describe("dateUtil", function(){

  var testcases_getDateOfWeek = [
   [ [2015, 1, 0], [2014, 11, 29] ],
   [ [2013, 1, 0], [2012, 11, 31] ],
   [ [1999, 1, 0], [1999, 0, 4] ]
  ]

  each(testcases_getDateOfWeek, function(testcase){
    it('getDateOfWeek(' + testcase[0].join(',') + ') == ' +
      testcase[1][0] + '-' + (testcase[1][1]+1) + '-' + testcase[1][2], function(){

      var date = dateUtil.getDateOfWeek.apply(dateUtil, testcase[0])
      expect(date.getFullYear()).to.equal(testcase[1][0])
      expect(date.getMonth()).to.equal(testcase[1][1])
      expect(date.getDate()).to.equal(testcase[1][2])
    })
  })

  var testcases_parseDate = [

    // DATETIME.
    [ "2009-01-01T00:00:00", [2009, 0, 1, 0, 0, 0, 0] ],
    [ "0000-01-01T00:00:00", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0001-01-01T00:00:00", [-1, 0, 1, 0, 0, 0, 0] ],
    // DATETIME: month boundary test.
    [ "2009-00-01T00:00:00", NaN ],
    [ "2009-12-01T00:00:00", [2009, 11, 1, 0, 0, 0, 0] ],
    [ "2009-13-01T00:00:00", NaN ],
    // DATETIME: date boundary test.
    [ "2009-01-00T00:00:00", NaN ],
    [ "2009-01-31T00:00:00", [2009, 0, 31, 0, 0, 0, 0] ],
    [ "2009-01-32T00:00:00", NaN ],
    // DATETIME: hours boundary test.
    [ "2009-01-01T-1:00:00", NaN ],
    [ "2009-01-01T23:00:00", [2009, 0, 1, 23, 0, 0, 0] ],
    [ "2009-01-01T24:00:00", NaN ],
    // DATETIME: minutes boundary test.
    [ "2009-01-01T00:-1:00", NaN ],
    [ "2009-01-01T00:59:00", [2009, 0, 1, 0, 59, 0, 0] ],
    [ "2009-01-01T00:60:00", NaN ],
    // DATETIME: seconds boundary test.
    [ "2009-01-01T00:00:-1", NaN ],
    [ "2009-01-01T00:00:59", [2009, 0, 1, 0, 0, 59, 0] ],
    [ "2009-01-01T00:00:60", NaN ],

    // DATETIME: space split date and time.
    //![ "2009-01-01 00:00:00", [2009, 0, 1, 0, 0, 0, 0] ],

    // DATETIME: no seconds.
    //![ "2009-01-01 00:00", [2009, 0, 1, 0, 0, 0, 0] ],
    [ "0000-01-01T00:00", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0001-01-01T00:00", [-1, 0, 1, 0, 0, 0, 0] ],
    // DATETIME: month boundary test.
    [ "2009-00-01T00:00", NaN ],
    [ "2009-12-01T00:00", [2009, 11, 1, 0, 0, 0, 0] ],
    [ "2009-13-01T00:00", NaN ],
    // DATETIME: date boundary test.
    [ "2009-01-00T00:00", NaN ],
    [ "2009-01-31T00:00", [2009, 0, 31, 0, 0, 0, 0] ],
    [ "2009-01-32T00:00", NaN ],
    // DATETIME: hours boundary test.
    [ "2009-01-01T-1:00", NaN ],
    [ "2009-01-01T23:00", [2009, 0, 1, 23, 0, 0, 0] ],
    [ "2009-01-01T24:00", NaN ],
    // DATETIME: minutes boundary test.
    [ "2009-01-01T00:-1", NaN ],
    [ "2009-01-01T00:59", [2009, 0, 1, 0, 59, 0, 0] ],
    [ "2009-01-01T00:60", NaN ],

    // DATE.
    [ "2009-01-00", NaN ],
    [ "2009-01-01", [2009, 0, 1, 0, 0, 0, 0] ],
    [ "2009-01-32", NaN ],
    [ "2009-02-28", [2009, 1, 28, 0, 0, 0, 0] ],
    [ "2009-02-29", NaN ],
    [ "2009-12-31", [2009, 11, 31, 0, 0, 0, 0] ],
    [ "2009-12-32", NaN ],
    [ "0100-12-31", [100, 11, 31, 0, 0, 0, 0] ],
    [ "0099-12-31", [99, 11, 31, 0, 0, 0, 0] ],
    [ "0001-12-31", [1, 11, 31, 0, 0, 0, 0] ],
    [ "0001-01-01", [1, 0, 1, 0, 0, 0, 0] ],
    [ "0000-01-01", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0000-01-01", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0001-01-01", [-1, 0, 1, 0, 0, 0, 0] ],

    [ "2009-00-01", NaN ],
    [ "2009-13-01", NaN ],
    [ "2009-100-01", NaN ],
    [ "2009-001-01", NaN ],
    [ "2009-01-001", NaN ],

    // MONTH.
    [ "2009-01", [2009, 0, 1, 0, 0, 0, 0] ],
    [ "2009-12", [2009, 11, 1, 0, 0, 0, 0] ],
    [ "0100-12", [100, 11, 1, 0, 0, 0, 0] ],
    [ "0099-12", [99, 11, 1, 0, 0, 0, 0] ],
    [ "0001-12", [1, 11, 1, 0, 0, 0, 0] ],
    [ "0001-01", [1, 0, 1, 0, 0, 0, 0] ],
    [ "0000-01", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0000-01", [0, 0, 1, 0, 0, 0, 0] ],
    [ "-0001-01", [-1, 0, 1, 0, 0, 0, 0] ],

    [ "2009-00", NaN ],
    [ "2009-13", NaN ],
    [ "2009-100", NaN ],
    [ "2009-001", NaN ],

    // TIME
    [ "00:00:00", [1900, 0, 1, 0, 0, 0, 0] ],
    [ "00:00:59", [1900, 0, 1, 0, 0, 59, 0] ],
    [ "00:00:60", NaN ],
    [ "00:59:00", [1900, 0, 1, 0, 59, 0, 0] ],
    [ "00:60:00", NaN ],
    [ "23:00:00", [1900, 0, 1, 23, 0, 0, 0] ],
    [ "24:00:00", NaN ],

    [ "00:00", [1900, 0, 1, 0, 0, 0, 0] ],
    [ "00:59", [1900, 0, 1, 0, 59, 0, 0] ],
    [ "00:60", NaN ],
    [ "23:00", [1900, 0, 1, 23, 0, 0, 0] ],
    [ "24:00", NaN ],

    // WEEK
    [ "2009-W01-1", [2008, 11, 29, 0, 0, 0, 0] ],
    [ "2009-W53-7", [2010, 0, 3, 0, 0, 0, 0] ],
    [ "2009-W54-1", NaN ],
    [ "2009-W01-0", NaN ],
    [ "2009-W01-8", NaN ],
    [ "2009-W541", NaN ],
    [ "2009-W010", NaN ],
    [ "2009-W018", NaN ],
    [ "2015-W01", [2014, 11, 29, 0, 0, 0, 0] ],
    [ "2015-W011", [2014, 11, 29, 0, 0, 0, 0] ],
    [ "2015-W01-1", [2014, 11, 29, 0, 0, 0, 0] ],

  ]

  each(testcases_parseDate, function(testcase){
    var desc = 'parseDate(' + testcase[0] + ') == ' +
      (isAbsNaN(testcase[1]) ? "NaN" :
        testcase[1][0] + '-' + (testcase[1][1]+1) + '-' + testcase[1][2] +
        "T" + testcase[1][3] + ":" + testcase[1][4] + ":" + testcase[1][5])

    it(desc, function(){

      var date = dateUtil.parseDate(testcase[0])

      if (isAbsNaN(testcase[1])) {
        expect(isAbsNaN(date)).to.equal(true)
      } else {
        expect("year:"+date.getFullYear()).to.equal("year:"+testcase[1][0])
        expect("month:"+date.getMonth()).to.equal("month:"+testcase[1][1])
        expect("date:"+date.getDate()).to.equal("date:"+testcase[1][2])
        expect("hours:"+date.getHours()).to.equal("hours:"+testcase[1][3])
        expect("minutes:"+date.getMinutes()).to.equal("minutes:"+testcase[1][4])
        expect("seconds:"+date.getSeconds()).to.equal("seconds:"+testcase[1][5])
      }
    })
  })

  var testcases_getWeeksOfYear = [
    [2015, 53],
    [2014, 52],
    [2013, 52],
    [2012, 52],
    [2011, 52],
    [2010, 52],
    [2009, 53],
    [2008, 52],
    [2007, 52],
    [2006, 52],
    [2005, 52],
    [2004, 53],
    [2003, 52],
    [2002, 52],
    [2001, 52],
    [2000, 52],
    [1999, 52],
    [1998, 53],
    [1997, 52],
    [1996, 52],
    [1995, 52],
    [1994, 52],
    [1993, 52],
    [1992, 53],
    [1991, 52],
    [1990, 52],
    [1989, 52],
    [1988, 52],
    [1987, 53],
    [1986, 52],
    [1985, 52],
    [1984, 52],
    [1983, 52],
    [1982, 52],
    [1981, 53],
    [1980, 52],
    [1979, 52],
    [1978, 52],
    [1977, 52],
    [1976, 53]
  ]

  each(testcases_getWeeksOfYear, function(testcase){
    var desc = 'getWeeksOfYear(' + testcase[0] + ') == ' + testcase[1]

    it(desc, function(){

      var weeks = dateUtil.getWeeksOfYear(testcase[0])
      expect(weeks).to.equal(testcase[1])

    })
  })


  var testcases_compareDate = [
    // date : date
    [ "1900-05-05", "1900-05-05", 0 ],
    [ "1901-05-05", "1900-05-05", 1 ],
    [ "1900-06-01", "1900-05-05", 1 ],
    [ "1900-05-06", "1900-05-05", 1 ],
    [ "1899-05-05", "1900-05-05", -1 ],
    [ "1900-04-05", "1900-05-05", -1 ],
    [ "1900-05-04", "1900-05-05", -1 ],

    // datetime : datetime
    [ "1900-05-05T05:05:05", "1900-05-05T05:05:05", 0 ],
    [ "1901-05-05T05:05:05", "1900-05-05T05:05:05", 1 ],
    [ "1900-06-05T05:05:05", "1900-05-05T05:05:05", 1 ],
    [ "1900-05-06T05:05:05", "1900-05-05T05:05:05", 1 ],
    [ "1900-05-05T06:05:05", "1900-05-05T05:05:05", 1 ],
    [ "1900-05-05T05:06:05", "1900-05-05T05:05:05", 1 ],
    [ "1900-05-05T05:05:06", "1900-05-05T05:05:05", 1 ],
    [ "1899-05-05T05:05:05", "1900-05-05T05:05:05", -1 ],
    [ "1900-04-05T05:05:05", "1900-05-05T05:05:05", -1 ],
    [ "1900-05-04T05:05:05", "1900-05-05T05:05:05", -1 ],
    [ "1900-05-05T04:05:05", "1900-05-05T05:05:05", -1 ],
    [ "1900-05-05T05:04:05", "1900-05-05T05:05:05", -1 ],
    [ "1900-05-05T05:05:04", "1900-05-05T05:05:05", -1 ],
    [ "1900-05-05T05:05", "1900-05-05T05:05", 0 ],
    [ "1901-05-05T05:05", "1900-05-05T05:05", 1 ],
    [ "1900-06-05T05:05", "1900-05-05T05:05", 1 ],
    [ "1900-05-06T05:05", "1900-05-05T05:05", 1 ],
    [ "1900-05-05T06:05", "1900-05-05T05:05", 1 ],
    [ "1900-05-05T05:06", "1900-05-05T05:05", 1 ],
    [ "1899-05-05T05:05", "1900-05-05T05:05", -1 ],
    [ "1900-04-05T05:05", "1900-05-05T05:05", -1 ],
    [ "1900-05-04T05:05", "1900-05-05T05:05", -1 ],
    [ "1900-05-05T04:05", "1900-05-05T05:05", -1 ],
    [ "1900-05-05T05:04", "1900-05-05T05:05", -1 ],

    // time : time
    [ "05:05:05", "05:05:05", 0 ],
    [ "06:05:05", "05:05:05", 1 ],
    [ "05:06:05", "05:05:05", 1 ],
    [ "05:05:06", "05:05:05", 1 ],
    [ "04:05:05", "05:05:05", -1 ],
    [ "05:04:05", "05:05:05", -1 ],
    [ "05:05:04", "05:05:05", -1 ],
    [ "05:05", "05:05", 0 ],
    [ "06:05", "05:05", 1 ],
    [ "05:06", "05:05", 1 ],
    [ "04:05", "05:05", -1 ],
    [ "05:04", "05:05", -1 ],

    // week : week
    [ "1900-W055", "1900-W055", 0],
    [ "1901-W055", "1900-W055", 1],
    [ "1900-W065", "1900-W055", 1],
    [ "1900-W056", "1900-W055", 1],
    [ "1899-W055", "1900-W055", -1],
    [ "1900-W045", "1900-W055", -1],
    [ "1900-W054", "1900-W055", -1],

    // date : *
    [ "2014-12-29", "2014-12-29T00:00:00", 0 ],
    [ "2014-12-29", "2014-12-29T00:00", 0 ],
    [ "1900-01-01", "00:00:00", 0 ],
    [ "1900-01-01", "00:00", 0 ],
    [ "2014-12-29", "2015-W011", 0 ],
    [ "2014-12-29", "2015-W01", 0 ]
  ]
  each(testcases_compareDate, function(testcase){
    it('compareDate(' + testcase[0] + ',' + testcase[1] + ') == ' + testcase[2], function(){

      expect(dateUtil.compareDate(testcase[0], testcase[1])).to.equal(testcase[2])

    })
  })

  var testcases_isDate = [
    [ "1900-01-01", true],
    [ "1900-12-01", true],
    [ "1900-12-31", true],
    [ "190a-01-01", false],
    [ "1900-00-01", false],
    [ "1900-13-01", false],
    [ "1900-01-00", false],
    [ "1900-01-32", false]
  ]
  each(testcases_isDate, function(testcase){
    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){

      expect(dateUtil.isDate(testcase[0])).to.equal(testcase[1])

    })
  })

  var testcases_isMonth = [
    [ "1900-01", true],
    [ "1900-12", true],
    [ "190a-01-01", false],
    [ "1900-00", false],
    [ "1900-13", false]
  ]
  each(testcases_isMonth, function(testcase){
    it('isMonth(' + testcase[0] + ') == ' + testcase[1], function(){

      expect(dateUtil.isMonth(testcase[0])).to.equal(testcase[1])

    })
  })

  var testcases_isDateTime = [
    [ "1900-01-01T00:00:00", true],
    [ "1900-12-01T00:00:00", true],
    [ "1900-12-31T00:00:00", true],
    [ "1900-01-01T23:00:00", true],
    [ "1900-01-01T00:59:00", true],
    [ "1900-01-01T00:00:59", true],
    //![ "1900-01-01 00:00:00", true],
    [ "1900-01-01", false],
    [ "1900-00-01T00:00:00", false],
    [ "1900-13-01T00:00:00", false],
    [ "1900-01-00T00:00:00", false],
    [ "1900-01-32T00:00:00", false],
    [ "1900-01-01T24:00:00", false],
    [ "1900-01-01T00:60:00", false],
    [ "1900-01-01T00:00:60", false],
    [ "1900-01-01T00:00", true],
    [ "1900-12-01T00:00", true],
    [ "1900-12-31T00:00", true],
    [ "1900-01-01T23:00", true],
    [ "1900-01-01T00:59", true],
    //![ "1900-01-01 00:00", true],
    [ "1900-00-01T00:00", false],
    [ "1900-13-01T00:00", false],
    [ "1900-01-00T00:00", false],
    [ "1900-01-32T00:00", false],
    [ "1900-01-01T24:00", false],
    [ "1900-01-01T00:60", false]
  ]
  each(testcases_isDateTime, function(testcase){
    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){

      expect(dateUtil.isDateTime(testcase[0])).to.equal(testcase[1])

    })
  })

  var testcases_isTime = [
    [ "00:00:00", true],
    [ "00:00:00", true],
    [ "00:00:00", true],
    [ "23:00:00", true],
    [ "00:59:00", true],
    [ "00:00:59", true],
    [ "1900-01-01", false],
    [ "24:00:00", false],
    [ "00:60:00", false],
    [ "00:00:60", false],
    [ "00:00", true],
    [ "23:00", true],
    [ "00:59", true],
    [ "24:00", false],
    [ "00:60", false]
  ]
  each(testcases_isTime, function(testcase){
    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){

      expect(dateUtil.isTime(testcase[0])).to.equal(testcase[1])

    })
  })

  var testcases_isWeek = [
    [ "2015-W01", true],
    [ "2015-W011", true],
    [ "2015-W017", true],
    [ "2015-W00", false],
    [ "2015-W010", false],
    [ "2015-W018", false]
  ]
  each(testcases_isWeek, function(testcase){
    it('isDate(' + testcase[0] + ') == ' + testcase[1], function(){

      expect(dateUtil.isWeek(testcase[0])).to.equal(testcase[1])

    })
  })

});
