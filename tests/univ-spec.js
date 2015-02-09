var expect = require('expect.js');
var Promise = this.Promise || require('promise')
var Validator = require('../index');

// Luhn 算法
// @see http://en.wikipedia.org/wiki/Luhn_algorithm
// @param {String} card, 被校验的号码。
// @return {Boolean} `true` 如果通过校验，否则返回 `false`。
function luhn(card){
  var sum = 0;
  for(var i=card.length-1,c,even; i>=0; i--){
    c = parseInt(card.charAt(i), 10);
    even = (i % 2) === (card.length % 2);
    if(even){
      c = c * 2;
      if(c > 9){
        c = c - 9;
      }
    }
    sum += c;
  }
  return sum % 10 === 0;
}

Validator.rule("isBankCard", function(values){

  if(Object.prototype.toString.call(values) !== '[object Array]'){
    values = [values.toString()];
  }

  var certified = true;
  var re_card = /^[34569][0-9]{12,18}$/;

  for(var i=0,l=values.length; i<l; i++){
    certified = certified && re_card.test(values[i]) && luhn(values[i]);
  }
  return certified;
});

var rule_required = {
  text: { type: "text", required: true },
  password: { type:"password", required: true },
  search: { type:"search", required: true }
};


function isEmptyObject(object){
  var isEmpty = true;
  for(var key in object){
    if (object.hasOwnProperty(key)){
      isEmpty = false;
    }
  }
  return isEmpty;
}

function testInvalid(validator, rule, data, done){
  var emitInvalidEvent = false;
  validator.on("invalid", function(name, value, validity){
    //!expect("invalid").to.equal("invalid");
    emitInvalidEvent = true;

    expect(validity.valid).to.equal(false);
    expect(validity.validationMessage).not.to.equal("valid");
    expect(
        validity.valid | 0 +
        validity.customError | 0 +
        validity.patternMismatch | 0 +
        validity.rangeOverflow | 0 +
        validity.rangeUnderflow | 0 +
        validity.stepMismatch | 0 +
        validity.tooLong | 0 +
        validity.tooShort | 0 +
        validity.typeMismatch | 0 +
        validity.valueMissing | 0 +
        validity.badInput | 0
      ).to.equal(1);

  }).on("valid", function(name, value, validity){
    expect("valid").to.equal("invalid");
  }).on("complete", function(certified){
    expect(certified).to.equal(false);
    if (!isEmptyObject(rule)){
      expect(emitInvalidEvent).to.equal(true);
    }
    validator.off();
    done();
  }).on("error", function(){ });
}

function testValid(validator, rule, data, done){
  var emitValidEvent = false;
  validator.on("invalid", function(name, values, validity){
    expect("invalid").to.equal("valid");
  }).on("valid", function(name, values, validity){
    emitValidEvent = true;

    expect(validity.valid).to.equal(true);

    expect(validity.customError).to.equal(false);
    expect(validity.patternMismatch).to.equal(false);
    expect(validity.rangeOverflow).to.equal(false);
    expect(validity.rangeUnderflow).to.equal(false);
    expect(validity.stepMismatch).to.equal(false);
    expect(validity.tooLong).to.equal(false);
    expect(validity.tooShort).to.equal(false);
    expect(validity.typeMismatch).to.equal(false);
    expect(validity.badInput).to.equal(false);

    expect("valid").to.equal("valid");
  }).on("complete", function(certified){
    expect(certified).to.equal(true);
    if (!isEmptyObject(rule)){
      expect(emitValidEvent).to.equal(true);
    }
    done();
  }).on("error", function(){ });
}

// TODO: add test case for more than two rule item.
// TODO: add test case for diff certify rule and data.

var testCases = [
  // non-rule
  // --------------------------------------------------------------------
  {
    "rule": {},
    "data": {},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:0},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:null},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:undefined},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:""},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:"1"},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:false},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:true},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:new Date()},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:/re/g},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:{}},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[undefined], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[null], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[,], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[0], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:["1"], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[false], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[true], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[/re/g], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[new Date()], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[{}], b:2},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:[1,2], b:2},
    "test": testValid
  },


  // require:false
  // --------------------------------------------------------------------
  {
    "rule": { a: {required: false} },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:0},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:null},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:undefined},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:""},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:"1"},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:false},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:true},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:new Date()},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:/re/g},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:{}},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[undefined], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[null], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[,], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[0], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:["1"], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[false], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[true], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[/re/g], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[new Date()], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[{}], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: false} },
    "data": {a:[1,2], b:2},
    "test": testValid
  },


  // require:true
  // --------------------------------------------------------------------
  {
    "rule": { a: {required: true} },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:0},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:null},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:undefined},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:""},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:"1"},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:false},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:true},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:new Date()},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:/re/g},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:{}},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:["", , , undefined, null], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[0], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:["1"], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[false], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[true], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[/re/g], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[new Date()], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[{}], b:2},
    "test": testValid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[1,2], b:2},
    "test": testValid
  },


  // minlength.
  // FIXME: test for minlength is minlimit now.
  {
    "rule": { a: { minlength: NaN } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: NaN } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: "" } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: "" } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: null }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: null }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: undefined }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: undefined }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: 2 }},
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: "1" },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: "12" },
    "test": testValid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: "123" },
    "test": testValid
  },

  {
    "rule": { a: { minlength: NaN } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: NaN } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: "" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: null } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: null } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: undefined }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: undefined }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlength: 2 }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: [0] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: [0,"",null,undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: ["01"] },
    "test": testValid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: ["012"] },
    "test": testValid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: ["01","abc"] },
    "test": testValid
  },


  // maxlength.
  {
    "rule": { a: { maxlength: NaN } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: NaN } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: "" } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: "" } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: null }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: null }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: undefined }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: undefined }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: 2 }},
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: "123" },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: "12" },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: "1" },
    "test": testValid
  },

  {
    "rule": { a: { maxlength: NaN } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: NaN } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: "" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: null } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: null } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: undefined }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: undefined }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlength: 2 }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: [null,undefined,,,""] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["1"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["12"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["123"] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["12","23"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["1"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["","0","12"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: ["012","1",""] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 1 }},
    "data": { a: [1,2,"",null,undefined] },
    "test": testInvalid
  },


  // minlimit.
  {
    "rule": { a: { minlimit: NaN } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: NaN } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: "" } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: "" } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: null }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: null }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: undefined }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: undefined }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: 2 }},
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: "1" },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 1 }},
    "data": { a: "1" },
    "test": testValid
  },

  {
    "rule": { a: { minlimit: NaN } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: NaN } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: "" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: null } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: null } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: undefined }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: undefined }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, minlimit: 2 }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: [0] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: [0,"",null,undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { minlimit: 2 }},
    "data": { a: ["0","a"] },
    "test": testValid
  },


  // maxlimit.
  {
    "rule": { a: { maxlimit: NaN } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: NaN } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: "" } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: "" } },
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: null }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: null }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: undefined }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: undefined }},
    "data": {},
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 2 }},
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: 2 }},
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: "1" },
    "test": testValid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: "1" },
    "test": testValid
  },
  {
    "rule": { a: { maxlimit: 2 }},
    "data": { a: "1" },
    "test": testValid
  },

  {
    "rule": { a: { maxlimit: NaN } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: NaN } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: "" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: null } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: null } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: undefined }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: undefined }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 2 }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, maxlimit: 2 }},
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: [1,2] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 2 }},
    "data": { a: ["1","2"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlimit: 2 }},
    "data": { a: ["1"] },
    "test": testValid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: ["0","",null,undefined] },
    "test": testValid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: [0,1,"",null,undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlimit: 1 }},
    "data": { a: [1,2,"",null,undefined] },
    "test": testInvalid
  },


  // rule: pattern.
  {
    "rule": { a: { pattern: "" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: "" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: null } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: null } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: undefined } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: undefined } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "a" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: "a" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "a" } },
    "data": { a: "a" },
    "test": testValid
  },
  {
    "rule": { a: { pattern: "b" } },
    "data": { a: "abc" },
    "test": testValid
  },
  {
    "rule": { a: { pattern: "^b" } },
    "data": { a: "abc" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "b" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: "" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "" } },
    "data": { a: ["",null,undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: "" } },
    "data": { a: ["",null,undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: null } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: null } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: undefined } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: undefined } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "a" } }, // not-required.
    "data": { a: [""] }, // no-value.
    "test": testValid
  },
  {
    "rule": { a: { required: true, pattern: "a" } }, // required.
    "data": { a: ["", , , null, undefined] }, // no-value.
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "a" } },
    "data": { a: ["a"] },
    "test": testValid
  },
  {
    "rule": { a: { pattern: "b" } },
    "data": { a: ["abc"] },
    "test": testValid
  },
  {
    "rule": { a: { pattern: "^b" } },
    "data": { a: ["abc"] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "b" } },
    "data": { a: ["a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { pattern: "a" } },
    "data": { a: ["a", "abc"] },
    "test": testValid
  },
  {
    "rule": { a: { pattern: "a" } },
    "data": { a: ["a", "abc", "b"] },
    "test": testInvalid
  },


  // rule: type=number
  {
    "rule": { a: { type: "number" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "number" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: " " },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: 0 },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: -1 },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: 1 },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "0" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "0.1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-0.1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "+0.1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ".1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-.1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "+.1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "0E0" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "1E0" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-1E0" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "+1E0" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-+.1" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: NaN },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: Number.MAX_VALUE },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: Number.MIN_VALUE },
    "test": testValid
  },
  // [Infinity is NOT a number](http://scienceblogs.com/goodmath/2008/10/13/infinity-is-not-a-number/)
  {
    "rule": { a: { type: "number" } },
    "data": { a: Number.POSITIVE_INFINITY },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: Number.NEGATIVE_INFINITY },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "number" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [" "] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["", , , null, undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "number" } },
    "data": { a: ["", , , null, undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [0] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [-1] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [1] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["0"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["-1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["1"] },
    "test": testValid
  },
  {
    "rule": { a: {
      accept: null,
      max: null,
      maxlength: null,
      min: null,
      minlength: null,
      multiple: false,
      pattern: null,
      required: false,
      step: null,
      type: "number"}
    },
    "data": { a: ["1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["0.1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["-0.1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["+0.1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [".1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["-.1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["+.1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["0E0"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["1E0"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["-1E0"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["+1E0"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [Number.MAX_VALUE] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [Number.MIN_VALUE] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [0, -1, 1, +1, 0.1, -0.1, +0.1, .1, -.1, +.1,
                  "0", "-1", "1", "+1", "0.1", "-0.1", "+0.1", ".1", "-.1", "+.1",
                  Number.MAX_VALUE, Number.MIN_VALUE] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "-+.1" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [NaN] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [Number.POSITIVE_INFINITY] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: [Number.NEGATIVE_INFINITY] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number" } },
    "data": { a: ["-+.1", "a", NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY] },
    "test": testInvalid
  },
  // [type=number][min]
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: 0 },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: 0 },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: "0" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: "0" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: 999 },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: 999 },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: "999" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: "999" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: 1000 },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: 1000 },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: "1000" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: "1000" },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: [0] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: [0] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: ["0"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: ["0"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: [999] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: [999] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: ["999"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: ["999"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: [0, "0", 999, "999"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: [0, "0", 999, "999"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: [1000] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: [1000] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: ["1000"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: ["1000"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: "1000" } },
    "data": { a: [1000, "1000"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "number", min: 1000 } },
    "data": { a: [1000, "1000"] },
    "test": testValid
  },


  // rule:type=date
  {
    "rule": { a: { type: "date" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "2014-06-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "123456-06-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "2014-06-01 00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "2014-06-32" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "2014-13-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ['', "", , , null, undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "date" } },
    "data": { a: ['', "", , , null, undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-06-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["123456-06-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-06-01", "123456-06-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-06-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-06-00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-06-32"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-00-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["2014-13-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ["a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date" } },
    "data": { a: ['', "", , , null, undefined,
      "2014-06-01 00:00:00",
      "2014-06-00", "2014-06-32",
      "2014-00-01", "2014-13-01", "a"] },
    "test": testInvalid
  },
  // [type=date][min]
  {
    "rule": { a: { type: "date", min: "" } },
    "data": { a: "2014-01-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014" } },
    "data": { a: "2014-01-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014-01-01" } },
    "data": { a: "2014-01-02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014-01-02" } },
    "data": { a: "2014-01-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date", min: "" } },
    "data": { a: ["2014-01-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014" } },
    "data": { a: ["2014-01-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014-01-01" } },
    "data": { a: ["2014-01-02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", min: "2014-01-02" } },
    "data": { a: ["2014-01-01"] },
    "test": testInvalid
  },
  // [type=date][max]
  {
    "rule": { a: { type: "date", max: "" } },
    "data": { a: "2014-01-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014" } },
    "data": { a: "2014-01-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014-01-02" } },
    "data": { a: "2014-01-02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014-01-02" } },
    "data": { a: "2014-01-03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "date", max: "" } },
    "data": { a: ["2014-01-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014" } },
    "data": { a: ["2014-01-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014-01-02" } },
    "data": { a: ["2014-01-01", "2014-01-02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "date", max: "2014-01-02" } },
    "data": { a: ["2014-01-03", "2014-02-01", "2015-01-01"] },
    "test": testInvalid
  },


  // rule:type=datetime
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-01-31T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:59:59" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:59:59Z" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:59:59-08:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:59:59+08:00" },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: "123456-06-01T00:00:00" },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-06-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-06-01 00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-01-32T00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-13-01T00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T24:59:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:60:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31T23:59:60" },
    "test": testInvalid
  },
  // FIXME: 时区加减范围为 12，共 24个时区
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: "2014-12-31T23:59:59-12:00" },
    //"test": testInvalid
  //},
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: "2014-12-31T23:59:59-11:60" },
    //"test": testInvalid
  //},
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["", '', , , null, undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime" } },
    "data": { a: ["", '', , , null, undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-31T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-31T00:00:00"] },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: ["123456-06-01T00:00:00"] },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [
      "2014-01-01T00:00:00", "2014-01-31T00:00:00", "2014-12-31T23:59:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-00-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-00T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01T60:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01T00:60:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01T00:00:60"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-32T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-13-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-32T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-13-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01T23:59:60", "2014-01-01T23:60:59",
      "2014-01-01T24:59:59", "2014-01-01T00:59:59",
      "2014-01-00T23:59:59", "2014-01-32T23:59:59",
      "2014-00-01T23:59:59", "2014-13-01T23:59:59",
      "2014-06-00", "a"] },
    "test": testInvalid
  },
  // [type=datetime][min]
  {
    "rule": { a: { type: "datetime", min:"" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:00:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:01:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T01:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-02T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-02-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: "2015-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:01:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T01:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-01T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-01-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: "2013-02-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:00:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:01:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T01:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-02T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-02-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2015-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-01-01T00:00:00" } },
    "data": { a: [
      "2014-01-01T00:00:00", "2014-01-01T00:00:01", "2014-01-01T00:01:00",
      "2014-01-01T01:00:00", "2014-01-02T00:00:00", "2014-02-01T00:00:00",
      "2015-01-01T00:00:00"
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:01:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T01:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-01T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-01-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2013-02-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", min:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:01", "2014-02-02T02:01:02", "2014-02-02T01:02:02",
      "2014-02-01T02:02:02", "2014-01-02T02:02:02", "2013-02-02T02:02:02"
    ] },
    "test": testInvalid
  },
  // [type=datetime][max]
  {
    "rule": { a: { type: "datetime", max:"" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:01:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T01:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-01T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-01-03T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2013-03-03T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:01:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T01:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-01T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-01-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2013-03-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:02", "2014-02-02T02:02:01", "2014-02-02T02:01:03",
      "2014-02-02T01:03:03", "2014-02-01T03:03:03", "2014-01-03T03:03:03",
      "2013-03-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:03:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T03:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-03T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-03-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: "2015-02-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:03"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:03:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T03:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-03T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-03-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2015-02-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime", max:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:03", "2014-02-02T02:03:02", "2014-02-02T03:02:02",
      "2014-02-03T02:02:02", "2014-03-02T02:02:02", "2015-02-02T02:02:02"
    ] },
    "test": testInvalid
  },


  // rule: type=datetime-local
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-01-31T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:59:59" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:59:59Z" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:59:59-08:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:59:59+08:00" },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime-local" } },
    //"data": { a: "123456-06-01T00:00:00" },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-06-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-06-01 00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-01-32T00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-13-01T00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T24:59:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:60:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "2014-12-31T23:59:60" },
    "test": testInvalid
  },
  // FIXME: 时区加减范围为 12，共 24个时区
  //{
    //"rule": { a: { type: "datetime-local" } },
    //"data": { a: "2014-12-31T23:59:59-12:00" },
    //"test": testInvalid
  //},
  //{
    //"rule": { a: { type: "datetime-local" } },
    //"data": { a: "2014-12-31T23:59:59-11:60" },
    //"test": testInvalid
  //},
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: "a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: [] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["", '', , , null, undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "datetime-local" } },
    "data": { a: ["", '', , , null, undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-06-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-31T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-31T00:00:00"] },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime-local" } },
    //"data": { a: ["123456-06-01T00:00:00"] },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: [
      "2014-01-01T00:00:00", "2014-01-31T00:00:00", "2014-12-31T23:59:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-00-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-00T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-01T60:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-01T00:60:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-01T00:00:60"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-32T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-13-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-06-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-06-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-32T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-13-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local" } },
    "data": { a: ["2014-01-01T23:59:60", "2014-01-01T23:60:59",
      "2014-01-01T24:59:59", "2014-01-01T00:59:59",
      "2014-01-00T23:59:59", "2014-01-32T23:59:59",
      "2014-00-01T23:59:59", "2014-13-01T23:59:59",
      "2014-06-00", "a"] },
    "test": testInvalid
  },
  // [type=datetime-local][min]
  {
    "rule": { a: { type: "datetime-local", min:"" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:00:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T00:01:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-01T01:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-01-02T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2014-02-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: "2015-01-01T00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:01:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T01:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-01T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2014-01-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: "2013-02-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:00:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T00:01:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-01T01:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-01-02T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2014-02-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: ["2015-01-01T00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-01-01T00:00:00" } },
    "data": { a: [
      "2014-01-01T00:00:00", "2014-01-01T00:00:01", "2014-01-01T00:01:00",
      "2014-01-01T01:00:00", "2014-01-02T00:00:00", "2014-02-01T00:00:00",
      "2015-01-01T00:00:00"
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:01:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T01:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-01T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-01-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: ["2013-02-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", min:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:01", "2014-02-02T02:01:02", "2014-02-02T01:02:02",
      "2014-02-01T02:02:02", "2014-01-02T02:02:02", "2013-02-02T02:02:02"
    ] },
    "test": testInvalid
  },
  // [type=datetime-local][max]
  {
    "rule": { a: { type: "datetime-local", max:"" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:01:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T01:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-01T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-01-03T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2013-03-03T03:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:01:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T01:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-01T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-01-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2013-03-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:02", "2014-02-02T02:02:01", "2014-02-02T02:01:03",
      "2014-02-02T01:03:03", "2014-02-01T03:03:03", "2014-01-03T03:03:03",
      "2013-03-03T03:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:02:03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T02:03:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-02T03:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-02-03T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2014-03-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: "2015-02-02T02:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:02:03"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T02:03:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-02T03:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-02-03T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2014-03-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: ["2015-02-02T02:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime-local", max:"2014-02-02T02:02:02" } },
    "data": { a: [
      "2014-02-02T02:02:03", "2014-02-02T02:03:02", "2014-02-02T03:02:02",
      "2014-02-03T02:02:02", "2014-03-02T02:02:02", "2015-02-02T02:02:02"
    ] },
    "test": testInvalid
  },



  // rule:type=time
  {
    "rule": { a: { type: "time" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:00:59" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:59:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "23:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "23:59:59" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:00:60" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:60:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "24:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "0a:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:0a:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:00:0a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "time" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:59:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["23:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["23:59:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:00", "00:00:59", "00:59:00", "23:00:00", "23:59:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:60"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:60:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["24:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["0a:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:0a:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:0a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: ["00:00:60", "00:60:00", "24:00:00", "00:0a:00", "00:0a:00", "00:00:0a"] },
    "test": testInvalid
  },
  // [type=time][min]
  {
    "rule": { a: { type: "time", min:"" } },
    "data": { a: "00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "02:02:02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "02:02:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "02:03:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "03:01:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:02:02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:02:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:03:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["03:01:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:02:02", "02:02:03", "02:03:01", "03:01:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "02:02:01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "02:01:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: "01:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:02:01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:01:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["01:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", min:"02:02:02" } },
    "data": { a: ["02:02:01", "02:01:02", "01:02:02"] },
    "test": testInvalid
  },
  // [type=time][max]
  {
    "rule": { a: { type: "time", max:"" } },
    "data": { a: "02:02:02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "02:02:02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "02:02:01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "02:01:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "01:03:03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"" } },
    "data": { a: ["02:02:02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:02:02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:02:01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:01:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["01:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:02:02", "02:02:01", "02:01:03", "01:03:03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "02:02:03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "02:03:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: "03:02:02" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:02:03"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:03:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["03:02:02"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time", max:"02:02:02" } },
    "data": { a: ["02:02:03", "02:03:01", "03:02:02"] },
    "test": testInvalid
  },


  // rule:type=week
  {
    "rule": { a: { type: "week" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: "2014-W01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: "2014-W52" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: "2014-W1" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: "2014-W53" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: "2014-W54" },
    "test": testInvalid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "week" } },
    //"data": { a: "123456-W01" },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "week" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "week" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W52"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W01", "2014-W52"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W1"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W53"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W54"] },
    "test": testInvalid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "week" } },
    //"data": { a: "123456-W01" },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "week" } },
    "data": { a: ["2014-W1", "2014-W54"] },
    "test": testInvalid
  },
  // [type=week][min]
  {
    "rule": { a: { type: "week", min:"" } },
    "data": { a: "2014-W01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: "2014-W02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: "2014-W03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: "2015-W01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: ["2014-W02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: ["2014-W03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: ["2015-W01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", min:"2014-W02" } },
    "data": { a: ["2014-W02", "2014-W03", "2015-W01"] },
    "test": testValid
  },
  // [type=week][max]
  {
    "rule": { a: { type: "week", max:"" } },
    "data": { a: "2014-W01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: "2014-W02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: "2014-W01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: "2013-W03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: ["2014-W02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: ["2014-W01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: ["2013-W03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "week", max:"2014-W02" } },
    "data": { a: ["2014-W02", "2014-W01", "2013-W03"] },
    "test": testValid
  },


  // rule:type=month
  {
    "rule": { a: { type: "month" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "2014-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "2014-12" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "123456-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "2014-00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "2014-13" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "month" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-12"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["123456-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-01", "2014-12", "123456-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-1"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["214-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-13"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: ["2014-1", "214-01", "2014-00", "2014-13"] },
    "test": testInvalid
  },
  // [type=month][min]
  {
    "rule": { a: { type: "month", min:"" } },
    "data": { a: "2014-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: "2014-02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: "2014-03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: "2015-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"" } },
    "data": { a: ["2014-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2014-02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2014-03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2015-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2014-02", "2014-03", "2015-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: "2014-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: "2013-03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2014-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2013-03"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", min:"2014-02" } },
    "data": { a: ["2014-01", "2013-03"] },
    "test": testInvalid
  },
  // [type=month][max]
  {
    "rule": { a: { type: "month", max:"" } },
    "data": { a: "2014-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: "2014-02" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: "2014-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: "2013-03" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"" } },
    "data": { a: ["2014-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2014-02"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2014-01"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2013-03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2014-02", "2014-01", "2013-03"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: "2014-03" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: "2015-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2014-03"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2015-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month", max:"2014-02" } },
    "data": { a: ["2014-03", "2015-01"] },
    "test": testInvalid
  },


  // rule:type=url
  {
    "rule": { a: { type: "url" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com/" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com#" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com/#" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com/####" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com/#flat:path/to/snip-code" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com?" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "https://www.example.com/?" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?a=1" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=2" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=%E4%B8%AD%E6%96%87" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?a=1&b=2#flag" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html#flag" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?#flag" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "http://www.example.com/path/to/page.html?#flag" },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: "ftp://www.example.com/path/to/page.html?#flag" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "url" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com/"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com#"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com/#"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com/####"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com/#flat:path/to/snip-code"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com?"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com/?"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?a=1"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=2"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=%E4%B8%AD%E6%96%87"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?a=1&b=2#flag"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html#flag"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?#flag"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com/path/to/page.html?#flag"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["http://www.example.com", "http://www.example.com/path/to/page.html?#flag"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["ftp://www.example.com/path/to/page.html?#flag"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "url" } },
    "data": { a: ["https://www.example.com?", "ftp://www.example.com/path/to/page.html?#flag"] },
    "test": testInvalid
  },


  // rule:type=email
  {
    "rule": { a: { type: "email" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "a@b.c" },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "a@b-inc.c" },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@def.ghi" },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc.def-ghi_jkl+mn@opq.rst" },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: " " },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@def" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@def." },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@def.ghi." },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@.def.ghi" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ".abc@def.ghi" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc.@def.ghi" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "abc@.def" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "@abc" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: "@abc." },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "email" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["a@b.c"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@def.ghi"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc.def-ghi_jkl+mn@opq.rst"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["a@b.c", "abc@def.ghi", "abc.def-ghi_jkl+mn@opq.rst"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [" "] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@def"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@def."] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@def.ghi."] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@.def.ghi"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [".abc@def.ghi"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc.@def.ghi"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["abc@.def"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["@abc"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: ["@abc."] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email" } },
    "data": { a: [" ", "abc", "abc@",
     "abc@def", "abc@def.", "abc@def.ghi.", "abc@.def.ghi",
     ".abc@def.ghi", "abc.@def.ghi",
      "abc@.def", "@abc", "@abc."] },
    "test": testInvalid
  },


  // rule:type=tel
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "0571-26888888" },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "(+86)0571-26888888" },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "13900000000" },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "0571-268888889" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "0571-2688888a" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "tel" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["0571-26888888"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["(+86)0571-26888888"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["0571-26888888", "(+86)0571-26888888"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["0571-268888889"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["0571-2688888a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: ["0571-268888889", "0571-2688888a"] },
    "test": testInvalid
  },
  {
    "rule": { a: {
      accept: null,
      max: null,
      maxlength: null,
      min: null,
      minlength: null,
      multiple: false,
      pattern: null,
      required: false,
      step: null,
      type: "tel",
    } },
    "data": { a: ["13900000000"] },
    "test": testValid
  },


  // rule:type=color
  {
    "rule": { a: { type: "color" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#000000" },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#ffffff" },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#FFFFFF" },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#FFFFFG" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#000" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#12345" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#123456" },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: "#1234567" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "color" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#000000"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#ffffff"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#FFFFFF"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#123456"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#000000", "#ffffff", "#FFFFFF", "#123456"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#000"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#fffffg"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#FFFFFG"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#12345"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#1234567"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "color" } },
    "data": { a: ["#000", "#fffffg", "#FFFFFG", "#12345", "#1234567"] },
    "test": testInvalid
  },


  // rule:type=file
  {
    "rule": { a: { type: "file" } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: null },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: null },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: undefined },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: undefined },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: {} },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: { name: "a.jpg" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: { name: "a.jpg" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: { name: "a", type:"image/jpeg" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: { name: "a", type:"image/jpeg" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: { name: "a.png" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: { name: "a", type:"image/png" } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: { name: "a.png" } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: { name: "a", type:"audio/mpeg" } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: { name: "a.mp3" } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: [""] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: [""] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: [null] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: [null] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: [undefined] },
    "test": testValid
  },
  {
    "rule": { a: { required: true, type: "file" } },
    "data": { a: [undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: [{}] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" } },
    "data": { a: [{ name: "a.jpg" }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: [{ name: "a.jpg" }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: [{ name: "a", type:"image/jpeg" }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: [ { name:"b", type:"image/png"} ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: [
      { name: "a", type:"image/jpeg" },
      { name:"b", type:"image/png"}
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*", "audio/*"] } },
    "data": { a: [
      { name: "a", type:"image/jpeg" },
      { name:"b", type:"image/png"},
      { name:"c.gif"},
      { name:"d", type:"audio/ogg"},
      { name:"e", type:"audio/mpeg"},
      { name:"f.mp3"}
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: [
      {},
      { name: "a.jpg" },
      { name: "a.jpg" },
      { name: "a", type:"image/jpeg" }
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: [{ name: "a", type:"image/png" }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg"] } },
    "data": { a: [{ name: "a.png" }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: [{ name: "a", type:"audio/mpeg" }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/*"] } },
    "data": { a: [{ name: "a.mp3" }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , accept: ["image/jpeg", "audio/*"] } },
    "data": { a: [
      { name: "a", type:"image/png" },
      { name: "b.png" },
      { name: "c.js" },
      { name: "d", type: "application/javascript"}
    ] },
    "test": testInvalid
  },
  // rule:[type=file][min]
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: { name: "a.mp3" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: { name: "a.mp3", size: 1000 } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: { name: "a.mp3", size: 0 } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: { name: "a.mp3", size: 999 } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [{ name: "a.mp3" }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 1000 }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [{ name: "a.mp3" }, { name: "a.mp3", size: 1000 }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 0 }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 999 }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , min: 1000 } },
    "data": { a: [
      { name: "a.mp3", size: 0 },
      { name: "a.mp3", size: 999 }
    ] },
    "test": testInvalid
  },
  // rule:[type=file][max]
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: { name: "a.mp3" } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: { name: "a.mp3", size: 1000 } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: { name: "a.mp3", size: 0 } },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: { name: "a.mp3", size: 1001 } },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [{ name: "a.mp3" }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 0 }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 1000 }] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [
      { name: "a.mp3" },
      { name: "a.mp3", size: 0 },
      { name: "a.mp3", size: 1000 }
    ] },
    "test": testValid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [{ name: "a.mp3", size: 1001 }] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "file" , max: 1000 } },
    "data": { a: [
      { name: "a.mp3", size: 1001 }
    ] },
    "test": testInvalid
  },


  // rule:custom function.
  {
    "rule": { a: { custom: null } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, custom: null } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: null } },
    "data": { a: "whatever." },
    "test": testValid
  },
  {
    "rule": { a: { custom: undefined } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, custom: undefined } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: undefined } },
    "data": { a: "whatever." },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(){
      return true;
    } } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, custom: function(){
      return true;
    } } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(){
      return true;
    } } },
    "data": { a: "whatever." },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(){
      return false;
    } } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, custom: function(){
      return false;
    } } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(){
      return false;
    } } },
    "data": { a: "whatever." },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return values==="ok";
    } } },
    "data": { a: "" },
    "test": testValid
  },
  {
    "rule": { a: { required: true, custom: function(values){
      return values==="ok";
    } } },
    "data": { a: "" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return values==="ok";
    } } },
    "data": { a: "ok" },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return values === "ok";
    } } },
    "data": { a: "whatever." },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(true);
        }, 100);
      });
    } } },
    "data": { a: "whatever." },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(false);
        }, 100);
      });
    } } },
    "data": { a: "whatever." },
    "test": testInvalid
  },
  // 2 async function validation.
  {
    "rule": { a: { custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(true);
        }, 100);
      });
    } },
    b: {custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(true);
        }, 100);
      });
    } } },
    "data": { a: "whatever.", b: "something..." },
    "test": testValid
  },
  // XXX: special, test invalid, rule a can-not valid.
  //{
    //"rule": { a: { custom: function(values){
      //setTimeout(function(){
        //callback(false);
      //}, 100);
    //} },
    //b: {custom: function(values){
      //setTimeout(function(){
        //callback(true);
      //}, 100);
    //} } },
    //"data": { a: "whatever.", b: "something..." },
    //"test": testInvalid
  //},
  //{
    //"rule": { a: { custom: function(values){
      //setTimeout(function(){
        //callback(true);
      //}, 100);
    //} },
    //b: {custom: function(values){
      //setTimeout(function(){
        //callback(false);
      //}, 100);
    //} } },
    //"data": { a: "whatever." },
    //"test": testInvalid
  //},
  {
    "rule": { a: { custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(false);
        }, 100);
      });
    } },
    b: {custom: function(values){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(false);
        }, 100);
      });
    } } },
    "data": { a: "whatever.", b: "something..." },
    "test": testInvalid
  },
  // custom function, and multiple rule mixin.
  {
    "rule": { a: { custom: function(values){
      return this.isEmail(values) || this.isMobile(values);
    } } },
    "data": { a: "a@b.c" },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isEmail(values) || this.isMobile(values);
    } } },
    "data": { a: "13900000000" },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      var certified = true;
      for(var i=0,l=values.length; i<l; i++){
        certified = certified &&
          (this.isEmail(values[i]) || this.isMobile(values[i]));
      }
      return certified;
    } } },
    "data": { a: ["a@b.c"] },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      var certified = true;
      for(var i=0,l=values.length; i<l; i++){
        certified = certified &&
          (this.isEmail(values[i]) || this.isMobile(values[i]));
      }
      return certified;
    } } },
    "data": { a: ["13900000000"] },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      var certified = true;
      for(var i=0,l=values.length; i<l; i++){
        certified = certified &&
          (this.isEmail(values[i]) || this.isMobile(values[i]));
      }
      return certified;
    } } },
    "data": { a: ["a@b.c", "13900000000"] },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isEmail(values) || this.isMobile(values);
    } } },
    "data": { a: "139000000000" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: "6228480323012001315" },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: ["6228480323012001315"] },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: ["6228480323012001315", // 农行
      "6226095711688726", "6225885860600709", // 招行
      "603367100131942126", // 杭州银行
      "6225683428000243950" //广发银行
    ] },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: "139000000000" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: "6228480323012001314" },
    "test": testInvalid
  },
  {
    "rule": { a: { custom: function(values){
      return this.isBankCard(values);
    } } },
    "data": { a: ["6228480323012001314"] },
    "test": testInvalid
  },

];

function getFunctionName(func){
  var m = func.toString().match(/^function\s+([a-zA-Z0-9]+)/);
  return m ? m[1] : "anonymous";
}

describe("validator", function(){

  for(var i=0,l=testCases.length; i<l; i++){

    var rule = testCases[i].rule;
    var data = testCases[i].data;
    var test = testCases[i].test;
    var testName = test.name || getFunctionName(test);
    var certified = testName === "testValid" ? "valid" : "invalid";
    var desc = 'RULE:' + JSON.stringify(rule) +
      ' ,DATA:' + JSON.stringify(data) +
      ' :' + certified;

    (function(desc, rule, data, test){

      it(desc, function(done) {

        var validator = new Validator(rule);

        test(validator, rule, data, done);

        validator.validate(data);

      });

    })(desc, rule, data, test);
  }

});
