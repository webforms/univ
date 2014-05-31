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
    "data": {a:[undefined], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[null], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: {required: true} },
    "data": {a:[,], b:2},
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
    "rule": { a: { minlength: "" } },
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { minlength: null }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { minlength: undefined }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: "" },
    "test": testValid
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
    "rule": { a: { minlength: "" } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { minlength: null } },
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { minlength: undefined }},
    "data": { a: [] },
    "test": testValid
  },
  {
    "rule": { a: { minlength: 2 }},
    "data": { a: [] },
    "test": testValid
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











  {
    "rule": { a: { required: true }},
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: { required: true }},
    "data": {a:[], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: { required: true }},
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": { a: { required: true }},
    "data": {a:[1,2], b:2},
    "test": testValid
  },


  // -------------------------------------------------------------------------

  // [type=text]:not-required
  {
    "rule": { a: { type: "text", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {a:[], b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {a:[1,2], b:2},
    "test": testValid
  },

  // [type=password]:not-required
  {
    "rule": { a: { type: "password", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {a:[], b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {a:[1], b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {a:[1,2], b:2},
    "test": testValid
  },

  {
    "rule": { a: { type: "email", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {a:1},
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {a:1, b:2},
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {a:[], b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {a:[1], b:2},
    "test": testInvalid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {a:[1,2], b:2},
    "test": testInvalid
  },

  {
    "rule": { a: { type: "radio", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "checkbox", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "select-one", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "select-multiple", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "hidden", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "search", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "textarea", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "file", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "number", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "range", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "date", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "week", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "month", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "time", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "datetime-local", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "url", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "tel", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "color", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "submit", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "button", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "reset", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "image", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "fieldset", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "legend", required: false }},
    "data": {},
    "test": testValid
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
