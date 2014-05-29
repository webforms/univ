var expect = require('expect.js');
var Validator = require('../index');

var rule_required = {
  text: { type: "text", required: true },
  password: { type:"password", required: true },
  search: { type:"search", required: true }
};


function testRequiredInvalid(validator, data, done){
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

function testRequiredValid(validator, data, done){
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
    "test": testRequiredValid
  },
  {
    "rule": {},
    "data": {a:1},
    "test": testRequiredValid
  },
  {
    "rule": {},
    "data": {a:1, b:2},
    "test": testRequiredValid
  },
  // require:false
  // --------------------------------------------------------------------
  {
    "rule": {a: {
      required: false
    }},
    "data": {},
    "test": testRequiredValid
  },
  {
    "rule": {a: {
      required: false
    }},
    "data": {a:1, b:2},
    "test": testRequiredValid
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
      var certified = testName === "testRequiredValid" ? "valid" : "invalid";
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
