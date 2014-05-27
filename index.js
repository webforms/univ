
var DEFAULT_RULER = {
  type: "text",
  required: false,
};

var Validator = function(ruler){
  this.ruler = ruler;
};

module.exports = Validator;
