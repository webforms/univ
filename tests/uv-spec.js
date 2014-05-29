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
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": {},
    "data": {a:1, b:2},
    "test": testValid
  },

  // require:false
  // --------------------------------------------------------------------
  {
    "rule": {a: { required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { required: false }},
    "data": {a:1},
    "test": testValid
  },
  {
    "rule": { a: { required: false }},
    "data": {a:1, b:2},
    "test": testValid
  },
  {
    "rule": { a: { type: "text", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "password", required: false }},
    "data": {},
    "test": testValid
  },
  {
    "rule": { a: { type: "email", required: false }},
    "data": {},
    "test": testValid
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
