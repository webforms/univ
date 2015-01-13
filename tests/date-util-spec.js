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
    // date
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

    // time
    [ "00:00:00", [1900, 0, 1, 0, 0, 0, 0] ],
    [ "00:00:59", [1900, 0, 1, 0, 0, 59, 0] ],
    [ "00:00:60", NaN ],
    [ "00:59:00", [1900, 0, 1, 0, 59, 0, 0] ],
    [ "00:60:00", NaN ],
    [ "23:00:00", [1900, 0, 1, 23, 0, 0, 0] ],
    [ "24:00:00", NaN ],

    // week
    [ "2009-W01-1", [2008, 11, 29, 0, 0, 0, 0] ],
    [ "2009-W53-7", [2010, 0, 3, 0, 0, 0, 0] ],
    [ "2015-01-01", [2015, 0, 1, 0, 0, 0, 0] ],
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
        expect(date.getFullYear()).to.equal(testcase[1][0])
        expect(date.getMonth()).to.equal(testcase[1][1])
        expect(date.getDate()).to.equal(testcase[1][2])
        expect(date.getHours()).to.equal(testcase[1][3])
        expect(date.getMinutes()).to.equal(testcase[1][4])
        expect(date.getSeconds()).to.equal(testcase[1][5])
      }
    })
  })

});
