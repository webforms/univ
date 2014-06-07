
var moment = require("moment");
var events = require("events").EventEmitter;

// @param {Object} rules
// @param {Function} handler
function eachRules(rules, handler){
  for(var ruleName in rules){
    if(rules.hasOwnProperty(ruleName)){
      handler.call(rules, ruleName, rules[ruleName]);
    }
  }
}
// TODO: to remove.
function eachValues0(handler, values){
  var certified = true;
  if(isArray(values)){
    for(var i=0,l=values.length; i<l; i++){
      certified = certified && handler(values[i]);
    }
    return certified;
  }
  return handler(values);
}
function eachValues(handler, values /* ,... */){
  var certified = true;
  var args = Array.prototype.slice.call(arguments, 0).slice(1);
  if(isArray(values)){
    for(var i=0,l=values.length; i<l; i++){
      args[0] = values[i];
      certified = certified && handler.apply(null, args);
    }
    return certified;
  }
  return handler.apply(null, args);
}

// @param {Object} object.
// @param {String} type, like `Array`, `RegExp`, etc.
function typeOf(object, type){
  return Object.prototype.toString.call(object) === "[object " + type + "]";
}

function isString(object){
  return typeOf(object, "String");
}

function isBoolean(object){
  return typeOf(object, "Boolean");
}

function isArray(object){
  return typeOf(object, "Array");
}

function isNumber(object){
  return !isNaN(object) && typeOf(object, "Number");
}

function isRegExp(object){
  return typeOf(object, "RegExp");
}

function isFunction(object){
  return typeOf(object, "Function");
}

function startsWith(string, prefix){
  return isString(string) && string.indexOf(prefix) === 0;
}
function endsWith(string, suffix) {
  return isString(string) &&
    string.indexOf(suffix, string.length - suffix.length) !== -1;
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
  "fieldset": "fieldset",
  "legend": "legend"
};
var DEFAULT_RULES = {
  type: RULE_TYPES["text"],
  required: false,
  max: NaN,
  min: NaN,
  maxlength: NaN,
  minlength: NaN,
  pattern: /.*/,
  custom: function(){return true;}
};


// 通常情况下的 required 校验。
// @param {Boolean,Undefined} required, is rule required?
// @param {String,Object} values, validation data.
// @return {Boolean,Undefined}
//        if !values and required, return false;
//        if !values and not-required, return true;
//        if values, validate passed, and continue next, return undefined.
function verifyRequired(required, values){
  if(isArray(values)){
    if(!verifyMinLengthList(1, values)){
      return !isBoolean(required) || !required;
    }
  }else{
    if("undefined"===typeof values || null===values || ""===values){
      return !isBoolean(required) || !required;
    }
  }
  //!return undefined;
}


function verifyIsNumber(value){
  return /^[+-]?\d+(?:[eE][+-]?\d+)?$/.test(value) ||
    /^[+-]?(?:\d+)?\.\d+(?:[eE][+-]?\d+)?$/.test(value);
}

function verifyMin(min, value){
  return isNaN(min) || value >= min;
}

function verifyMax(max, value){
  return isNaN(max) || value <= max;
}

function verifyMinLengthList(minlength, values){
  if(!isNumber(minlength)){return true;}
  if(!isArray(values) || values.length < minlength){return false;}

  var length = 0;
  for(var i=0,l=values.length; i<l; i++){
    if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
      length++;
    }
  }

  return length >= minlength;
}

function verifyMaxLengthList(maxlength, values){
  if(!isNumber(maxlength)){return true;}
  if(!isArray(values)){return false;}

  var length = 0;
  for(var i=0,l=values.length; i<l; i++){
    if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
      length++;
    }
  }

  return length <= maxlength;
}

function verifyMinLength(minlength, value){
  return !isNumber(minlength) || value.length >= minlength;
}

function verifyMaxLength(maxlength, value){
  return !isNumber(maxlength) || value.length <= maxlength;
}

var RE_MONTH = /^\d{4,}\-\d{2}$/;
function verifyIsMonth(value){
  return RE_MONTH.test(value) && moment(value).isValid();
}

// TODO: #4, remove moment.
var RE_TIME = /^\d{2}:\d{2}:\d{2}$/;
function verifyIsTime(value){
  return RE_TIME.test(value) && moment("2014-01-01 " + value).isValid();
}

function verifyMinMonth(min, value){
  return isNaN(min) || (verifyIsMonth(min) && moment(value) >= moment(min));
}

function verifyMinTime(min, value){
  return isNaN(min) || (verifyIsTime(min) && moment(value) >= moment(min));
}

function verifyMaxMonth(max, value){
  return isNaN(max) || (verifyIsMonth(max) && moment(value) >= moment(max));
}

function verifyMaxTime(max, value){
  return isNaN(max) || (verifyIsTime(max) && moment(value) >= moment(max));
}

var RE_DATE = /^\d{4,}\-\d{2}\-\d{2}$/;
function verifyIsDate(value){
  return RE_DATE.test(value) && moment(value).isValid();
}

function verifyMinDate(min, value){
  return isNaN(min) || (verifyIsDate(min) && moment(value) >= moment(min));
}

function verifyMaxDate(max, value){
  return isNaN(max) || (verifyIsDate(max) && moment(value) >= moment(max));
}


// http://www.w3.org/TR/html-markup/input.datetime.html
var RE_DATETIME = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
function verifyIsDateTime(value){
  return RE_DATETIME.test(value) && moment(value).isValid();
}

function verifyMinDateTime(min, value){
  return isNaN(min) || (verifyIsDateTime(min) && moment(value) >= moment(min));
}

function verifyMaxDateTime(max, value){
  return isNaN(max) || (verifyIsDateTime(max) && moment(value) >= moment(max));
}


// [input=type=datetime-local](http://www.w3.org/TR/html-markup/input.datetime-local.html)
var RE_DATETIME_LOCAL = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
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
var RE_WEEK = /^\d{4,}-W\d{2}$/;
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
function verifyIsUrl(values){
  return RE_URL.test(values);
}


var RE_EMAIL = /^\w+(?:[\._+\-]\w+)*@\w+(?:\.\w+)+$/;
function verifyIsEmail(value){
  return RE_EMAIL.test(value);
}


var RE_MOBILE = /^(?:13[0-9]|14[57]|15[0-35-9]|170|18[0-9])\d{8}$/;
function verifyIsMobile(value){
  return RE_MOBILE.test(value);
}


var RE_TEL = /^(?:\(\+\d{2}\))?\d{3,4}\-\d{7,8}$/;
function verifyIsTel(value){
  return RE_TEL.test(value);
}


var RE_COLOR = /^#[0-9a-fA-F]{6}$/;
function verifyIsColor(value){
  return RE_COLOR.test(value);
}

function verifyPattern(pattern, value, instance_context){
  if(!isRegExp(pattern)){

    if(!isString(pattern)){return true;}

    try{
      pattern = new RegExp(pattern);
    }catch(ex){
      instance_context._evt.emit("error", ex);
      return true;
    }
  }

  return pattern.test(value);
}

function verifyPatternList(pattern, values, instance_context){
  var certified = true;
  for(var i=0,l=values.length; i<l; i++){
    certified = certified && verifyPattern(pattern, values[i], instance_context);
  }
  return certified;
}

function verifyFunction(ruleFunction, value, certifiedCallback){
  if(!isFunction(ruleFunction)){return true;}
  var result = ruleFunction.call(null, value, certifiedCallback);
  if("undefined" !== typeof result){
    return result;
  }
}

var MIME_TYPE = {
  "txt": "text/plain",
  "htm": "text/html",
  "html": "text/html",
  "js": "application/javascript",
  "css": "text/css",
  "csv": "text/csv",
  "xml": "text/xml",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "pdf": "application/pdf",
  "doc": "application/msword",
  "docx": "application/msword",
  "zip": "application/zip",
  "mp3": "audio/mpeg",
  "ogg": "audio/ogg"
};
function typeByName(fileName){
  var ext = fileName.split(".").slice(-1);
  if(MIME_TYPE.hasOwnProperty(ext)){
    return MIME_TYPE[ext];
  }
}

// @param {Array} accept.
// @param {File} file.
// @return {Boolean}
function verifyFileType(file, accept){
  if(!isArray(accept) || !file || !file.name){return true;}
  for(var i=0,l=accept.length; i<l; i++){
    if(!file.type){
      file.type = typeByName(file.name);
    }
    if(accept[i] === file.type){
      return true;
    }else if(endsWith(accept[i], "/*") &&
        startsWith(file.type, accept[i].replace(/\*$/, "")) ){
      return true;
    }
  }
  return false;
}

function verifyMinFileSize(file, min){
  if(!isNumber(min) || !isNumber(file.size)){return true;}
  return file.size >= min;
}
function verifyMaxFileSize(file, max){
  if(!isNumber(max) || !isNumber(file.size)){return true;}
  return file.size <= max;
}

function verify(ruleName, rule, values, instance_context){

  var certified = true;
  var validity = {
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    typeMismatch: false,
    valueMissing: false,
    badInput: false,
    valid: true
  };

  var resultRequired = verifyRequired(rule.required, values);
  // fast return if required rule not match.
  if("undefined" !== typeof resultRequired){
    return resultRequired;
  }

  if(isArray(values)){

    certified = certified &&
      verifyMinLengthList(rule.minlength, values) &&
      verifyMaxLengthList(rule.maxlength, values) &&
      verifyPatternList(rule.pattern, values, instance_context);

  }else{

    certified = certified &&
      verifyMinLength(rule.minlength, values) &&
      verifyMaxLength(rule.maxlength, values) &&
      verifyPattern(rule.pattern, values, instance_context);

  }


  // rule: type, min, max.
  switch(rule.type){
  case RULE_TYPES.number:
  case RULE_TYPES.range:
    certified = certified &&
      eachValues(verifyIsNumber, values) &&
      verifyMin(rule.min, values) &&
      verifyMax(rule.max, values);
    break;

  case RULE_TYPES.date:
    certified = certified &&
      eachValues(verifyIsDate, values) &&
      verifyMinDate(rule.min, values) &&
      verifyMaxDate(rule.max, values);
    break;

  case RULE_TYPES.datetime:
    certified = certified &&
      eachValues(verifyIsDateTime, values) &&
      verifyMinDateTime(rule.min, values) &&
      verifyMaxDateTime(rule.max, values);
    break;

  case RULE_TYPES["datetime-local"]:
    certified = certified &&
      eachValues(verifyIsDateTimeLocal, values) &&
      verifyMinDateTimeLocal(rule.min, values) &&
      verifyMaxDateTimeLocal(rule.max, values);
    break;

  case RULE_TYPES.time:
    certified = certified &&
      eachValues(verifyIsTime, values) &&
      verifyMinTime(rule.min, values) &&
      verifyMaxTime(rule.max, values);
    break;

  case RULE_TYPES.week:
    certified = certified &&
      eachValues(verifyIsWeek, values) &&
      verifyMinWeek(rule.min, values) &&
      verifyMaxWeek(rule.max, values);
    break;

  case RULE_TYPES.month:
    certified = certified &&
      eachValues(verifyIsMonth, values) &&
      verifyMinMonth(rule.min, values) &&
      verifyMaxMonth(rule.max, values);
    break;

  case RULE_TYPES.url:
    certified = certified && eachValues(verifyIsUrl, values);
    break;

  case RULE_TYPES.email:
    certified = certified && eachValues(verifyIsEmail, values);
    break;

  case RULE_TYPES.tel:
    certified = certified && eachValues(verifyIsTel, values);
    break;

  case RULE_TYPES.color:
    certified = certified && eachValues(verifyIsColor, values);
    break;

  case RULE_TYPES.file:
    certified = certified &&
      eachValues(verifyFileType, values, rule.accept) &&
      eachValues(verifyMinFileSize, values, rule.min) &&
      eachValues(verifyMaxFileSize, values, rule.max);
    break;

  //case RULE_TYPES.select-one:
  //case RULE_TYPES.radio:
  //case RULE_TYPES.text:
  //case RULE_TYPES.search:
  //case RULE_TYPES.textarea:
  //case RULE_TYPES.checkbox:
  //case RULE_TYPES["select-multiple"]:
  //case RULE_TYPES.password:
  //default:
    //break;
  }

  //! NOTE: do not each values for verifyFunction, each values in
  //        custom function if need.
  var result = verifyFunction(rule.custom, values, function(certified){

    instance_context._evt.emit(certified ? "valid":"invalid", ruleName, values, validity);

    if(--instance_context._pending === 0){
      instance_context._evt.emit("complete", instance_context._certified && certified);
      instance_context._certified = true;
    }
  });

  instance_context._certified = certified;

  if(typeof result !== "undefined"){
    certified = certified && result;
    instance_context._evt.emit(certified ? "valid":"invalid", ruleName, values, validity);
    return certified;
  }else{
    instance_context._pending++;
  }

}


var Validator = function(rules){
  this._rules = rules;
  this._evt = new events();
  this._pending = 0;
  this._certified = true;
};

Validator.prototype.validate = function(data){

  var certified = true;
  var ME = this;

  eachRules(this._rules, function(ruleName, rule){

    var values = data[ruleName];
    var result = verify(ruleName, rule, values, ME);
    certified = certified && result;

  });

  if(this._pending === 0){
    ME._evt.emit("complete", certified);
    ME._certified = true;
  }

  return this;
};

Validator.prototype.on = function(eventName, handler){
  this._evt.on(eventName, handler);
  return this;
};

Validator.prototype.off = function(eventName, handler){
  if(isFunction(handler)){
    this._evt.removeListener(eventName, handler);
  }else{
    this._evt.removeAllListeners(eventName);
  }
  return this;
};

module.exports = Validator;
