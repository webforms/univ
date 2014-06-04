var expect = require('expect.js');
var Validator = require('../index');

var rule_required = {
  text: { type: "text", required: true },
  password: { type:"password", required: true },
  search: { type:"search", required: true }
};


function testInvalid(validator, data, done){
  validator.on("invalid", function(name, value, validity){
    expect("invalid").to.equal("invalid");
  }).on("valid", function(name, value, validity){
    expect("valid").to.equal("invalid");
  }).on("complete", function(certified){
    expect(certified).to.equal(false);
    validator.off();
    done();
  });
}

function testValid(validator, data, done){
  validator.on("invalid", function(name, values, validity){
    expect("invalid").to.equal("valid");
  }).on("valid", function(name, values, validity){
    expect("valid").to.equal("valid");
  }).on("complete", function(certified){
    expect(certified).to.equal(true);
    done();
  });
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
    "rule": { a: { minlength: 1 }},
    "data": { a: "1" },
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
    "data": { a: [0,"1"] },
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
    "rule": { a: { maxlength: 1 }},
    "data": { a: "12" },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 1 }},
    "data": { a: "1" },
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
    "rule": { a: { maxlength: 1 }},
    "data": { a: [1,2] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: [1,2] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 2 }},
    "data": { a: [1] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 1 }},
    "data": { a: [0,"",null,undefined] },
    "test": testValid
  },
  {
    "rule": { a: { maxlength: 1 }},
    "data": { a: [0,1,"",null,undefined] },
    "test": testInvalid
  },
  {
    "rule": { a: { maxlength: 1 }},
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
    "data": { a: "2014-01-01 00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-01-31 00:00:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31 23:59:59" },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: "123456-06-01 00:00:00" },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-06-01" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-06-01T00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-01-32 00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-13-01 00:00:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31 24:59:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31 23:60:59" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: "2014-12-31 23:59:60" },
    "test": testInvalid
  },
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
    "data": { a: ["2014-06-01 00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01 00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-31 00:00:00"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-31 00:00:00"] },
    "test": testValid
  },
  // FIXME: moment() not support 5 digit year.
  //{
    //"rule": { a: { type: "datetime" } },
    //"data": { a: ["123456-06-01 00:00:00"] },
    //"test": testValid
  //},
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: [
      "2014-01-01 00:00:00", "2014-01-31 00:00:00", "2014-12-31 23:59:59"] },
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-00-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-00 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01 60:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01 00:60:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-01 00:00:60"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-32 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-13-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01T00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-01-32 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-13-01 00:00:00"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["a"] },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "datetime" } },
    "data": { a: ["2014-06-01", "2014-06-00", "a"] },
    "test": testInvalid
  },


  // TODO: rule: type=datetime-local



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
    "data": { a: "00:00:60" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:59:00" },
    "test": testValid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "00:60:00" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "time" } },
    "data": { a: "23:00:00" },
    "test": testValid
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
    "data": { a: "2014-W53" },
    "test": testValid
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
    "data": { a: "2014-00" },
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
    "data": { a: "2014-13" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "123456-01" },
    "test": testValid
  },
  {
    "rule": { a: { type: "month" } },
    "data": { a: "2014-13" },
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
    "data": { a: "0571-268888889" },
    "test": testInvalid
  },
  {
    "rule": { a: { type: "tel" } },
    "data": { a: "0571-2688888a" },
    "test": testInvalid
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
    "rule": { a: { custom: function(values, callback){
      setTimeout(function(){
        callback(true);
      }, 100);
    } } },
    "data": { a: "whatever." },
    "test": testValid
  },
  {
    "rule": { a: { custom: function(values, callback){
      setTimeout(function(){
        callback(false);
      }, 100);
    } } },
    "data": { a: "whatever." },
    "test": testInvalid
  },
  // 2 async function validation.
  {
    "rule": { a: { custom: function(values, callback){
      setTimeout(function(){
        callback(true);
      }, 100);
    } },
    b: {custom: function(values, callback){
      setTimeout(function(){
        callback(true);
      }, 100);
    } } },
    "data": { a: "whatever.", b: "something..." },
    "test": testValid
  },
  // XXX: special, test invalid, rule a can-not valid.
  //{
    //"rule": { a: { custom: function(values, callback){
      //setTimeout(function(){
        //callback(false);
      //}, 100);
    //} },
    //b: {custom: function(values, callback){
      //setTimeout(function(){
        //callback(true);
      //}, 100);
    //} } },
    //"data": { a: "whatever.", b: "something..." },
    //"test": testInvalid
  //},
  //{
    //"rule": { a: { custom: function(values, callback){
      //setTimeout(function(){
        //callback(true);
      //}, 100);
    //} },
    //b: {custom: function(values, callback){
      //setTimeout(function(){
        //callback(false);
      //}, 100);
    //} } },
    //"data": { a: "whatever." },
    //"test": testInvalid
  //},
  {
    "rule": { a: { custom: function(values, callback){
      setTimeout(function(){
        callback(false);
      }, 100);
    } },
    b: {custom: function(values, callback){
      setTimeout(function(){
        callback(false);
      }, 100);
    } } },
    "data": { a: "whatever.", b: "something..." },
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

          test(validator, data, done);

          validator.validate(data);

        });

      })(desc, rule, data, test);
    }
});
