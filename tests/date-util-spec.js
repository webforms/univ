var expect = require('expect.js');
var dateUtil = require('../date-util');

describe("date util", function(){

  it('getDateOfWeek', function() {

    var week_2015 = dateUtil.getDateOfWeek(2015, 1, 0)
    expect(week_2015.getFullYear()).to.equal(2014)
    expect(week_2015.getMonth()).to.equal(11)
    expect(week_2015.getDate()).to.equal(29)

    var week_2013 = dateUtil.getDateOfWeek(2013, 1, 0)
    expect(week_2013.getFullYear()).to.equal(2012)
    expect(week_2013.getMonth()).to.equal(11)
    expect(week_2013.getDate()).to.equal(31)

    var week_1999 = dateUtil.getDateOfWeek(1999, 1, 0)
    expect(week_1999.getFullYear()).to.equal(1999)
    expect(week_1999.getMonth()).to.equal(0)
    expect(week_1999.getDate()).to.equal(4)

  });

  it("parseDate('2009-W01-1')", function(){
    var date_2015 = dateUtil.parseDate("2009-W01-1")
    expect(date_2015.getFullYear()).to.equal(2008)
    expect(date_2015.getMonth()).to.equal(11)
    expect(date_2015.getDate()).to.equal(29)
  })

  it("parseDate('2009-W53-7')", function(){
    var date_2015 = dateUtil.parseDate("2009-W53-7")
    expect(date_2015.getFullYear()).to.equal(2010)
    expect(date_2015.getMonth()).to.equal(0)
    expect(date_2015.getDate()).to.equal(3)
  })

  it("parseDate('2015-01-01')", function(){
    var date_2015 = dateUtil.parseDate("2015-01-01")
    expect(date_2015.getFullYear()).to.equal(2015)
    expect(date_2015.getMonth()).to.equal(0)
    expect(date_2015.getDate()).to.equal(1)
  })

  it("parseDate('2015-W01')", function(){
    var date_2015 = dateUtil.parseDate("2015-W01")
    expect(date_2015.getFullYear()).to.equal(2014)
    expect(date_2015.getMonth()).to.equal(11)
    expect(date_2015.getDate()).to.equal(29)
  })

  it("parseDate('2015-W011')", function(){
    var date_2015 = dateUtil.parseDate("2015-W011")
    expect(date_2015.getFullYear()).to.equal(2014)
    expect(date_2015.getMonth()).to.equal(11)
    expect(date_2015.getDate()).to.equal(29)
  })

  it("parseDate('2015-W01-1')", function(){
    var date_2015 = dateUtil.parseDate("2015-W01-1")
    expect(date_2015.getFullYear()).to.equal(2014)
    expect(date_2015.getMonth()).to.equal(11)
    expect(date_2015.getDate()).to.equal(29)
  })


});
