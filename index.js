
var moment = require("moment");

// @param {Object} rules
// @param {Function} handler
function eachRules(rules, handler){
  for(var ruleName in rules){
    if(rules.hasOwnProperty(ruleName)){
      handler.call(rules, ruleName, rules[ruleName]);
    }
  }
}

// @param {Object} object.
// @param {String} type, like `Array`, `RegExp`, etc.
function typeOf(object, type){
  return Object.prototype.toString.call(object) === "[object " + type + "]";
}

function isArray(object){
  return typeOf(object, "Array");
}

function isRegExp(object){
  return typeOf(object, "RegExp");
}

function isFunction(object){
  return typeOf(object, "Function");
}



var RULE_TYPES = {
  "text": "text",
  "password": "password",
  "email": "email",
  "radio": "radio",
  "checkbox": "checkbox",
  "select-one": "select-one",
  "select-multiple": "select-multiple",
  "hidden": "hidden",
  "search": "search",
  "textarea": "textarea",
  "file": "file",
  "number": "number",
  "range": "range",
  "date": "date",
  "week": "week",
  "month": "month",
  "time": "time",
  "datetime": "datetime",
  "datetime-local": "datetime-local",
  "url": "url",
  "tel": "tel",
  "color": "color",
  "submit": "submit",
  "button": "button",
  "reset": "reset",
  "image": "image",
  "fieldset": "fieldset"
};
var DEFAULT_RULES = {
  type: RULE_TYPES["text"],
  required: false,
  max: NaN,
  min: NaN,
  maxlength: NaN,
  minlength: NaN,
  patterm: /.*/,
  custom: function(){}
};


var RE_BLANK = /^\s*$/; // 空白字符。

// 通常情况下的 required 校验。
function verifyRequired(rule, value){
  return !RE_BLANK.test(value);
}

// 特殊的密码非空校验。
function verifyRequiredPassword(value){
  return value === "";
}

// 列表项非空校验
//
// * checkbox
// * select-multiple
//
// @param {Array} values
// @return {Boolean}
function verifyRequiredList(values){
  return isArray(values) && values.length > 0;
}

function verifyIsNumber(value){
  return /^[+-]?\d+$/.test(num) || /^[+-]?(?:\d+)?\.\d+$/.test(num);
}

function verifyMin(min, value){
  return isNaN(min) || value >= min;
}

function verifyMax(max, value){
  return isNaN(max) || value <= max;
}

function verifyMinLengthList(minlength, values){
  if(isNaN(minlength)){return true;}
  if(!isArray(values) || values.length < minlength){return false;}

  for(var i=0,l=values.length; i<l; i++){
    if(!RE_BLANK.test(values[i])){
      length++;
    }
  }

  return length >= minlength;
}

function verifyMaxLengthList(maxlength, values){
  if(isNaN(maxlength)){return true;}
  if(!isArray(values) || values.length > maxlength){return false;}

  for(var i=0,l=values.length; i<l; i++){
    if(!RE_BLANK.test(values[i])){
      length++;
    }
  }

  return length <= maxlength;
}

function verifyMinLength(minlength, value){
  return isNaN(minlength) || value.length >= minlength;
}

function verifyMaxLength(maxlength, value){
  return isNaN(maxlength) || value.length <= maxlength;
}

var RE_MONTH = /^\d{4}\-\d{1,2}$/;
function verifyIsMonth(value){
  return RE_MONTH.test(value) && moment(value).isValid();
}

function verifyMinMonth(min, value){
  return isNaN(min) || (verifyIsMonth(min) && moment(value) >= moment(min));
}

function verifyMaxMonth(max, value){
  return isNaN(max) || (verifyIsMonth(max) && moment(value) >= moment(max));
}

var RE_DATE = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
function verifyIsDate(value){
  return RE_DATE.test(value) && moment(value).isValid();
}

function verifyMinDate(min, value){
  return isNaN(min) || (verifyIsDate(min) && moment(value) >= moment(min));
}

function verifyMaxDate(max, value){
  return isNaN(max) || (verifyIsDate(max) && moment(value) >= moment(max));
}


var RE_DATETIME = /^\d{4}\-\d{1,2}\-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/;
function verifyIsDateTime(value){
  return RE_DATETIME.test(value) && moment(value).isValid();
}

function verifyMinDateTime(min, value){
  return isNaN(min) || (verifyIsDateTime(min) && moment(value) >= moment(min));
}

function verifyMaxDateTime(max, value){
  return isNaN(max) || (verifyIsDateTime(max) && moment(value) >= moment(max));
}


// TODO:
var RE_DATETIME_LOCAL = /^\d{4}\-\d{1,2}\-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/;
function verifyIsDateTimeLocal(value){
  return RE_DATETIME_LOCAL.test(value) && moment(value).isValid();
}

function verifyMinDateTimeLocal(min, value){
  return isNaN(min) || (verifyIsDateTimeLocal(min) && moment(value) >= moment(min));
}

function verifyMaxDateTimeLocal(max, value){
  return isNaN(max) || (verifyIsDateTimeLocal(max) && moment(value) >= moment(max));
}


// TODO: week
var RE_WEEK = /^\d{4}W\d{1,2}$/;
function verifyIsWeek(value){
  return RE_WEEK.test(value) && moment(value).isValid();
}

// TODO:
function verifyMinWeek(min, value){
  return isNaN(min) || (verifyIsWeek(min) && moment(value) >= moment(min));
}

// TODO:
function verifyMaxWeek(max, value){
  return isNaN(max) || (verifyIsWeek(max) && moment(value) >= moment(max));
}


// [RFC1738](http://www.faqs.org/rfcs/rfc1738.html)
var RE_URL = /^https?:\/\/(?:[\w.-]*(?::[^@]+)?@)?(?:[\w-]+\.){1,3}[\w]+(?::\d+)?(?:\/.*)?$/;
function verifyIsUrl(value){
  return RE_URL.test(value);
}


var RE_EMAIL = /^\w+(?:[\._\-]\w+)*@\w+(?:\.\w+)+$/;
function verifyIsEmail(value){
  return RE_EMAIL.test(value);
}


var RE_MOBILE = /^(?:13[0-9]|14[57]|15[0-35-9]|170|18[0-9])\d{8}$/;
function verifyIsMobile(value){
  return RE_MOBILE.test(value);
}


var RE_TEL = /^\d{3,4}\-\d{7,8}$/;
function verifyIsTel(value){
  return RE_TEL.test(value);
}


var RE_COLOR = /^#[0-9a-fA-F]{6}$/;
function verifyIsColor(value){
  return RE_COLOR.test(value);
}

function verifyPattern(patterm, value){
  if(!isRegExp(patterm)){
    try{
      patterm = new RegExp(patterm);
    }catch(ex){
      // TODO: emit error event.
      return false;
    }
  }

  return patterm.test(value);
}

// TODO:
function verifyFunction(ruleFunction, value){
  if(!isFunction(ruleFunction)){return true;}
  var result = ruleFunction.call(null, value);
  if("undefined" !== typeof result){
    return result;
  }
}

function verify(rule, values){

  var certified = true;

  switch(rule.type){
  case RULE_TYPES.submit:
  case RULE_TYPES.button:
  case RULE_TYPES.reset:
  case RULE_TYPES.image:
  case RULE_TYPES.hidden:
  case RULE_TYPES.fieldset:
    return true;

  case RULE_TYPES.number:
  case RULE_TYPES.range:
    var value = Number(values);
    certified = certified &&
      verifyIsNumber(values) &&
      verifyMin(rule.min, value) &&
      verifyMax(rule.max, value);
    break;

  case RULE_TYPES.checkbox:
  case RULE_TYPES["select-multiple"]:
    certified = certified &&
      verifyRequiredList(values) &&
      verifyMinLengthList(rule.minlength, values) &&
      verifyMaxLengthList(rule.maxlength, values);
    break;

  case RULE_TYPES.password:
    certified = certified &&
      verifyRequiredPassword(values) &&
      verifyMinLength(rule.minlength, values) &&
      verifyMaxLength(rule.maxlength, values);
    break;

  case RULE_TYPES.file:
    return false; // TODO: diff for web and node.

  case RULE_TYPES.date:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsDate(values) &&
      verifyMinDate(rule.min, values) &&
      verifyMaxDate(rule.max, values);
    break;

  case RULE_TYPES.datetime:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsDateTime(values) &&
      verifyMinDateTime(rule.min, values) &&
      verifyMaxDateTime(rule.max, values);
    break;

  case RULE_TYPES["datetime-local"]:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsDateTimeLocal(values) &&
      verifyMinDateTimeLocal(rule.min, values) &&
      verifyMaxDateTimeLocal(rule.max, values);
    break;

  case RULE_TYPES.week:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsWeek(values) &&
      verifyMinWeek(rule.min, values) &&
      verifyMaxWeek(rule.max, values);
    break;

  case RULE_TYPES.month:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsMonth(values) &&
      verifyMinMonth(rule.min, values) &&
      verifyMaxMonth(rule.max, values);
    break;

  case RULE_TYPES.url:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsUrl(values) &&
      verifyMinLength(rule.min, values) &&
      verifyMaxLength(rule.max, values);
    break;

  case RULE_TYPES.email:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsEmail(values) &&
      verifyMinLength(rule.min, values) &&
      verifyMaxLength(rule.max, values);
    break;

  case RULE_TYPES.tel:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsTel(values) &&
      verifyMinLength(rule.min, values) &&
      verifyMaxLength(rule.max, values);
    break;

  case RULE_TYPES.color:
    certified = certified &&
      verifyRequired(values) &&
      verifyIsColor(values) &&
      verifyMinLength(rule.min, values) &&
      verifyMaxLength(rule.max, values);
    break;

  //case RULE_TYPES.select-one:
  //case RULE_TYPES.radio:
  //case RULE_TYPES.text:
  //case RULE_TYPES.search:
  //case RULE_TYPES.textarea:
  default:
    certified = certified &&
      verifyRequired(rule, values) &&
      verifyMinLength(rule.minlength, values) &&
      verifyMaxLength(rule.maxlength, values);
  }

  certified = certified && verifyPattern(rule.patterm, value);
  certified = certified && verifyFunction(rule.script, value);

}


var Validator = function(rules){
  this._rules = rules;
};

Validator.prototype.validate = function(data){

  var certified = true;

  eachRules(this._rules, function(ruleName, rule){

    var values = data[ruleName];
    certified = certified && verify(rule, values);

  });

};

module.exports = Validator;
