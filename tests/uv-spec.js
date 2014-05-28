var expect = require('expect.js');
var Validator = require('../index');

var rule_required = {
  text: { type: "text", required: true },
  password: { type:"password", required: true },
  search: { type:"search", required: true }
};

function required_invalid(rule, data){
describe("each items required, data is empty.", function(){
  var validator = new Validator(rule);

  validator.on("valid", function(name, validity, values){

    it('[required][name=' + name + '][value=' + values + ']:valid', function(done) {
      expect(true).to.equal(false);
      done();
    });

  }).on("invalid", function(name, validity, values){

    it('[required][name=' + name + '][value=' + values + ']:invalid', function(done) {
      expect(true).to.equal(true);
      done();
    });

  }).on("complete", function(certified){

    it('[required]:complete:invalid', function(done) {
      expect(certified).to.equal(false);
      done();
    });

  });

  validator.validate(data);
});

}

required_invalid(rule_required, {});
required_invalid(rule_required, {
  text: "",
  password: "",
  search: ""
});
required_invalid(rule_required, {
  text: " ",
  password: " ",
  search: " "
});

describe("each items required, data is undefined.", function(){
  var validator = new Validator(rule_required);

  validator.on("valid", function(name, validity, values){

    it('[required][name=' + name + '][value=' + values + ']:valid', function(done) {
      expect(true).to.equal(false);
      done();
    });

  }).on("invalid", function(name, validity, values){

    it('[required][name=' + name + '][value=' + values + ']:invalid', function(done) {
      expect(true).to.equal(true);
      done();
    });

  }).on("complete", function(certified){

    it('[required]:complete:invalid', function(done) {
      expect(certified).to.equal(false);
      done();
    });

  });

  validator.validate({
  });
});

describe('uv', function() {

  // complete
  it('required complete', function(done) {

    var validator = new Validator({
      text: { required: true },
      password: { required: true },
      search: { required: true }
    });

    validator.on("valid", function(name, validity, values){
      expect(true).to.equal(false);
      console.log("valid:", name)
    }).on("invalid", function(name, validity, values){
      expect(true).to.equal(true);
      console.log("invalid:", name)
    }).on("complete", function(certified){
      console.log("complete", certified);
      done();
    });

    validator.validate({
      text: "",
      password: "",
      search: ""
    });

  });

});
