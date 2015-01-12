var expect = require('expect.js');
var dateUtil = require('../date-util');

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
   [ "2009-W01-1", [2008, 11, 29] ],
   [ "2009-W53-7", [2010, 0, 3] ],
   [ "2015-01-01", [2015, 0, 1] ],
   [ "2015-W01", [2014, 11, 29] ],
   [ "2015-W011", [2014, 11, 29] ],
   [ "2015-W01-1", [2014, 11, 29] ]
  ]

  each(testcases_parseDate, function(testcase){
    it('parseDate(' + testcase[0] + ') == ' +
      testcase[1][0] + '-' + (testcase[1][1]+1) + '-' + testcase[1][2], function(){

      var date = dateUtil.parseDate(testcase[0])
      expect(date.getFullYear()).to.equal(testcase[1][0])
      expect(date.getMonth()).to.equal(testcase[1][1])
      expect(date.getDate()).to.equal(testcase[1][2])
    })
  })

});
