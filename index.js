
var Promise = this.Promise || require("promise")
var Events = require("events").EventEmitter;
var dateUtil = require("./date-util");

var BUILD_IN_RULE = {
  isEmail: function(email){
    return verifyIsEmail(email, {});
  },
  isUrl: verifyIsUrl,
  isNumber: verifyIsNumber,
  isTel: verifyIsTel,
  isColor: verifyIsColor,
  isDate: verifyIsDate,
  isDateTime: verifyIsDateTime,
  isDateTimeLocal: verifyIsDateTimeLocal,
  isMonth: verifyIsMonth,
  isWeek: verifyIsWeek,
  isTime: verifyIsTime,
  isMobile: function(mobile){
    return verifyIsMobile(mobile, {});
  }
};

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
function isObject(object){
  return null!==object && typeOf(object, "Object");
}

function isPromise(object) {
  return object && typeof object.then === 'function';
}

// #12, 同时支持 Promise 和非 Promise。
// 对于 Promise，等待其兑现。
// 对于非 Promise，立即执行，提高性能。
function UniPromise (promise, resolve, reject) {
  if (isPromise(promise)) {
    return promise.then(resolve, reject)
  } else {
    return resolve(promise)
  }
}

function trim(string){
  return String(string).replace(/^\s+/, "").replace(/\s+$/, "");
}

// @param {Object} object.
// @return {Number} return number if object can convert to number,
//                  else return NaN.
function toNumber(object){
  if(isNumber(object)){return object;}
  object = trim(object);
  if("" === object){return NaN;}
  return Number(object);
}

// @param {Object} rules
// @param {Function} handler
// @param {Function} placehandler, optional. When has not item, call placehorder handler.
function eachRules(rules, handler, placehandler){
  var hasRule = false;
  for(var ruleName in rules){
    if(rules.hasOwnProperty(ruleName)){
      hasRule = true;
      handler.call(rules, ruleName, rules[ruleName]);
    }
  }
  if (!hasRule && isFunction(placehandler)) {
    placehandler()
  }
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

function merge(/* ... */){
  var result = {};
  for(var i=0,object,l=arguments.length; i<l; i++){
    object = arguments[i];
    if(!isObject(object)){continue;}

    for(var key in object){
      if(object.hasOwnProperty(key)){
        result[key] = object[key]
      }
    }

  }

  return result;
}

function startsWith(string, prefix){
  return isString(string) && string.indexOf(prefix) === 0;
}
function endsWith(string, suffix) {
  return isString(string) &&
    string.indexOf(suffix, string.length - suffix.length) !== -1;
}


// 通常情况下的 required 校验。
// @param {Boolean,Undefined} required, is rule required?
// @param {String,Object} values, validation data.
// @return {Boolean,Undefined}
//        if !values and required, return false;
//        if !values and not-required, return true;
//        if values, validate passed, and continue next, return undefined.
function verifyRequired(required, values){
  if(isArray(values)){
    if(!verifyMinLimit(1, values)){
      return !isBoolean(required) || !required;
    }
  }else{
    if("undefined"===typeof values || null===values || ""===values){
      return !isBoolean(required) || !required;
    }
  }
  //!return undefined;
}


function verifyIsNumber(value, validity){
  var certified = /^[+-]?\d+(?:[eE][+-]?\d+)?$/.test(value) ||
    /^[+-]?(?:\d+)?\.\d+(?:[eE][+-]?\d+)?$/.test(value);
  validity.typeMismatch = !certified;
  return certified;
}

function verifyMin(value, min, validity){
  var certified;
  value = toNumber(value);
  min = toNumber(min);
  if(!isNumber(min)){
    certified = true;
  } else if(!isNumber(value)){
    certified = false;
  } else {
    certified = value >= min;
  }

  validity.rangeUnderflow = !certified;

  return certified;

  //return !isNumber(min) || isNumber(value) && Number(value) >= Number(min);
}

function verifyMax(value, max, validity){
  var certified;
  value = toNumber(value);
  max = toNumber(max);
  if(!isNumber(max)){
    certified = true;
  } else if(!isNumber(value)){
    certified = false;
  } else {
    certified = value <= max;
  }
  // XXX: Non-Effect.
  validity.rangeOverflow = !certified;
  return certified;

  //return !isNumber(max) || isNumber(value) && Number(value) <= Number(max);
}

function verifyMinLimit(minlimit, values, validity){
  var certified;
  var length = 0;

  minlimit = toNumber(minlimit);

  if(!isNumber(minlimit)){return true;}
  if(!isArray(values)){
    values = [ values ];
  }

  if(values.length < minlimit){
    certified = false;
  } else {

    for(var i=0,l=values.length; i<l; i++){
      if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
        length++;
      }
    }

  }

  certified = length >= minlimit;
  if (validity) {
    // XXX: tooShort? no. rangeUnderflow? no. is tooFew.
    validity.customError = !certified;
  }
  return certified;
}

function verifyMaxLimit(maxlimit, values, validity){

  maxlimit = toNumber(maxlimit);
  if(!isNumber(maxlimit)){return true;}
  if(!isArray(values)){
    values = [ values ];
  }

  var length = 0;
  for(var i=0,l=values.length; i<l; i++){
    if("undefined"!==typeof values[i] && null!==values[i] && ""!==values[i]){
      length++;
    }
  }

  var certified = length <= maxlimit;
  if (validity) {
    // XXX: tooLong? no. rangeOverflow? no. is tooMuch.
    validity.customError = !certified;
  }
  return certified;
}

function verifyMinLengthList(minlength, values, validity){
  minlength = toNumber(minlength);
  if(!isNumber(minlength)){return true;}

  var certified = true;
  for(var i=0,l=values.length; i<l; i++){
    certified = certified && verifyMinLength(minlength, values[i], validity);
  }

  return certified;
}

function verifyMaxLengthList(maxlength, values, validity){
  maxlength = toNumber(maxlength);
  if(!isNumber(maxlength)){return true;}

  var certified = true;
  for(var i=0,l=values.length; i<l; i++){
    certified = certified && verifyMaxLength(maxlength, values[i], validity);
  }

  return certified;
}

function verifyMinLength(minlength, value, validity){
  minlength = toNumber(minlength);
  var certified = !isNumber(minlength) ||
         (isString(value) && value.length >= minlength);
  validity.tooShort = !certified;
  return certified;
}

function verifyMaxLength(maxlength, value, validity){
  maxlength = toNumber(maxlength);
  var certified = !isNumber(maxlength) ||
         (isString(value) && value.length <= maxlength);
  validity.tooLong = !certified;
  return certified;
}

function verifyIsMonth(value, validity){
  var certified = dateUtil.isMonth(value);
  validity.typeMismatch = !certified;
  return certified;
}

function verifyMinMonth(value, min, instance_context, validity){
  if(!min){return true;}
  if(!verifyIsMonth(min, validity)){
    instance_context._evt.emit("error",
      new TypeError('[type=month][min='+min+'] is invalid month.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxMonth(value, max, instance_context, validity){
  if(!max){return true;}
  if(!verifyIsMonth(max, validity)){
    instance_context._evt.emit("error",
      new TypeError('[type=month][max='+max+'] is invalid month.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  validity.rangeOverflow = !certified;
  return certified;
}

function verifyIsTime(value, validity){
  var certified = dateUtil.isTime(value);
  validity.typeMismatch = !certified;
  return certified;
}

function verifyMinTime(value, min, instance_context, validity){
  if(!min){return true;}
  if(!verifyIsTime(min, validity)){
    instance_context._evt.emit("error",
      new TypeError('[type=time][min='+min+'] is invalid time.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxTime(value, max, instance_context, validity){
  if(!max){return true;}
  if(!verifyIsTime(max, validity)){
    instance_context._evt.emit("error",
      new TypeError('[type=time][max='+max+'] is invalid time.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  validity.rangeOverflow = !certified;
  return certified;
}

function verifyIsDate(value, validity){
  var certified = dateUtil.isDate(value);
  if (validity){
    validity.typeMismatch = !certified;
  }
  return certified;
}

function verifyMinDate(value, min, instance_context, validity){
  if(!min){return true;}
  // Do't change validity on verify `min` rule.
  if(!verifyIsDate(min /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=date][min='+min+'] is invalid date.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxDate(value, max, instance_context, validity){
  if(!max){return true;}
  // Do't change validity on verify `max` rule.
  if(!verifyIsDate(max/* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=date][max='+max+'] is invalid date.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  validity.rangeOverflow = !certified;
  return certified;
}


// http://www.w3.org/TR/html-markup/input.datetime.html
function verifyIsDateTime(value, validity){
  var certified = dateUtil.isDateTime(value);
  if (validity) {
    validity.typeMismatch = !certified;
  }
  return certified;
}

function verifyMinDateTime(value, min, instance_context, validity){
  if(!min){return true;}
  // Do't change validity on verify `min` rule.
  // TODO: test cases.
  if(!verifyIsDateTime(min /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=datetime][min='+min+'] is invalid datetime.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxDateTime(value, max, instance_context, validity){
  if(!max){return true;}
  // Do't change validity on verify `max` rule.
  // TODO: test cases.
  if(!verifyIsDateTime(max /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=datetime][max='+max+'] is invalid datetime.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  validity.rangeOverflow = !certified;
  return certified;
}


// [input=type=datetime-local](http://www.w3.org/TR/html-markup/input.datetime-local.html)
var RE_DATETIME_LOCAL = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;
function verifyIsDateTimeLocal(value, validity){
  var certified = dateUtil.isDateTime(value);
  if (validity) {
    validity.typeMismatch = !certified;
  }
  return certified;
}

function verifyMinDateTimeLocal(value, min, instance_context, validity){
  if(!min){return true;}
  // Do't change validity on verify `min` rule.
  // TODO: test cases.
  if(!verifyIsDateTimeLocal(min /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=datetime-local][min='+min+'] is invalid datetime.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxDateTimeLocal(value, max, instance_context, validity){
  if(!max){return true;}
  // Do't change validity on verify `max` rule.
  // TODO: test cases.
  if(!verifyIsDateTimeLocal(max /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=datetime-local][max='+max+'] is invalid datetime.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  validity.rangeOverflow = !certified;
  return certified;
}


var RE_WEEK = /^\d{4,}-W\d{2}$/;
function verifyIsWeek(value, validity){
  var certified = dateUtil.isWeek(value);
  if (validity) {
    validity.typeMismatch = !certified;
  }
  return certified;
}

function verifyMinWeek(value, min, instance_context, validity){
  if(!min){return true;}
  // Do't change validity on verify `min` rule.
  // TODO: test cases.
  if(!verifyIsWeek(min /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=week][min='+min+'] is invalid week.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, min) >= 0;
  // XXX: Non-Effect.
  validity.rangeUnderflow = !certified;
  return certified;
}

function verifyMaxWeek(value, max, instance_context, validity){
  if(!max){return true;}
  // Do't change validity on verify `max` rule.
  // TODO: test cases.
  if(!verifyIsWeek(max /* , validity */)){
    instance_context._evt.emit("error",
      new TypeError('[type=week][max='+max+'] is invalid week.'));
    return true;
  }
  var certified = dateUtil.distanceDate(value, max) <= 0;
  // XXX: Non-Effect.
  validity.rangeOverflow = !certified;
  return certified;
}


// [RFC1738](http://www.faqs.org/rfcs/rfc1738.html)
var RE_URL = /^https?:\/\/(?:[\w.-]*(?::[^@]+)?@)?(?:[\w-]+\.){1,3}[\w]+(?::\d+)?(?:\/.*)?$/;
function verifyIsUrl(value, validity){
  var certified = RE_URL.test(value);
  validity.typeMismatch = !certified;
  return certified;
}


var RE_EMAIL = /^\w+(?:[\._+\-]\w+)*@\w+(?:\.\w+)+$/;
function verifyIsEmail(value, validity){
  var certified = RE_EMAIL.test(value);
  validity.typeMismatch = !certified;
  return certified;
}


var RE_MOBILE = /^(?:13[0-9]|14[57]|15[0-35-9]|170|18[0-9])\d{8}$/;
function verifyIsMobile(value, validity){
  var certified = RE_MOBILE.test(value);
  validity.typeMismatch = !certified;
  return certified;
}


var RE_TEL = /^(?:\(\+\d{2}\))?\d{3,4}\-\d{7,8}$/;
function verifyIsTel(value, validity){
  var certified = RE_TEL.test(value);
  validity.typeMismatch = !certified;
  return certified;
}


var RE_COLOR = /^#[0-9a-fA-F]{6}$/;
function verifyIsColor(value, validity){
  var certified = RE_COLOR.test(value);
  validity.typeMismatch = !certified;
  return certified;
}

function verifyPattern(pattern, value, instance_context, validity){
  if(!isRegExp(pattern)){

    if(!isString(pattern)){return true;}

    try{
      pattern = new RegExp(pattern);
    }catch(ex){
      instance_context._evt.emit("error", ex);
      return true;
    }
  }
  var certified = pattern.test(value);
  validity.patternMismatch = !certified;

  return certified;
}

function verifyPatternList(pattern, values, instance_context, validity){
  var certified = true;
  for(var i=0,l=values.length; i<l; i++){
    certified = certified && verifyPattern(pattern, values[i], instance_context, validity);
  }
  return certified;
}

function verifyFunction(ruleFunction, value, datas){
  if(!isFunction(ruleFunction)){return true;}

  var build_in_rule = merge(BUILD_IN_RULE, {
    data: function(key){
      return datas[key];
    }
  });

  return ruleFunction.call(build_in_rule, value);
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
function verifyFileType(file, accept, validity){
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
  validity.typeMismatch = true;
  return false;
}

function verifyMinFileSize(file, min, validity){
  if(!isNumber(min) || !isNumber(file.size)){return true;}
  var certified = file.size >= min;
  validity.tooShort = !certified;
  return certified;
}
function verifyMaxFileSize(file, max, validity){
  if(!isNumber(max) || !isNumber(file.size)){return true;}
  var certified = file.size <= max;
  validity.tooLong = !certified;
  return certified;
}

var ValidityState = {
  customError: "customError",
  patternMismatch: "patternMismatch",
  rangeOverflow: "rangeOverflow",
  rangeUnderflow: "rangeUnderflow",
  stepMismatch: "stepMismatch",
  tooLong: "tooLong",
  tooShort: "tooShort",
  typeMismatch: "typeMismatch",
  valueMissing: "valueMissing",
  badInput: "badInput",
  valid: "valid"
};

function verify(ruleName, rule, values, datas, instance_context){

    var certified = true;
    var validity = {
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valueMissing: false,
      badInput: false,
      valid: true,
      validationMessage: ValidityState.valid
    };

    var resultRequired = verifyRequired(rule.required, values);
    // fast return if required rule not match.
    if("undefined" !== typeof resultRequired){

      if (resultRequired === false) {
        validity.valueMissing = true;
        validity.valid = false;
        validity.validationMessage = ValidityState.valueMissing;
      }

      instance_context._evt.emit(resultRequired ? "valid":"invalid", ruleName, values, validity);

      return resultRequired;
    }

    if(isArray(values)){

      certified = certified &&
        verifyMinLengthList(rule.minlength, values, validity) &&
        verifyMaxLengthList(rule.maxlength, values, validity) &&
        verifyPatternList(rule.pattern, values, instance_context, validity);

    }else{

      certified = certified &&
        verifyMinLength(rule.minlength, values, validity) &&
        verifyMaxLength(rule.maxlength, values, validity) &&
        verifyPattern(rule.pattern, values, instance_context, validity);

    }

    // FIXME: validity.
    certified = certified &&
      verifyMinLimit(rule.minlimit, values, validity) &&
      verifyMaxLimit(rule.maxlimit, values, validity);


    // rule: type, min, max.
    switch(rule.type){
    case RULE_TYPES.number:
    case RULE_TYPES.range:
      certified = certified &&
        eachValues(verifyIsNumber, values, validity) &&
        eachValues(verifyMin, values, rule.min, validity) &&
        eachValues(verifyMax, values, rule.max, validity);
      break;

    case RULE_TYPES.date:
      certified = certified &&
        eachValues(verifyIsDate, values, validity) &&
        eachValues(verifyMinDate, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxDate, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES.datetime:
      certified = certified &&
        eachValues(verifyIsDateTime, values, validity) &&
        eachValues(verifyMinDateTime, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxDateTime, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES["datetime-local"]:
      certified = certified &&
        eachValues(verifyIsDateTimeLocal, values, validity) &&
        eachValues(verifyMinDateTimeLocal, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxDateTimeLocal, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES.time:
      certified = certified &&
        eachValues(verifyIsTime, values, validity) &&
        eachValues(verifyMinTime, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxTime, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES.week:
      certified = certified &&
        eachValues(verifyIsWeek, values, validity) &&
        eachValues(verifyMinWeek, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxWeek, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES.month:
      certified = certified &&
        eachValues(verifyIsMonth, values, validity) &&
        eachValues(verifyMinMonth, values, rule.min, instance_context, validity) &&
        eachValues(verifyMaxMonth, values, rule.max, instance_context, validity);
      break;

    case RULE_TYPES.url:
      certified = certified && eachValues(verifyIsUrl, values, validity);
      break;

    case RULE_TYPES.email:
      certified = certified && eachValues(verifyIsEmail, values, validity);
      break;

    case RULE_TYPES.tel:
      certified = certified && (
          eachValues(verifyIsTel, values, validity) ||
          eachValues(verifyIsMobile, values, validity)
        );
      break;

    case RULE_TYPES.color:
      certified = certified && eachValues(verifyIsColor, values, validity);
      break;

    case RULE_TYPES.file:
      certified = certified &&
        eachValues(verifyFileType, values, rule.accept, validity) &&
        eachValues(verifyMinFileSize, values, rule.min, validity) &&
        eachValues(verifyMaxFileSize, values, rule.max, validity);
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

    return UniPromise(
        //! NOTE: Do't each loop values by verifyFunction,
        //        each loop values in user custom function if need.
        verifyFunction(rule.custom, values, datas),
        function(result){

          if (!result) {
            validity.customError = true;
            validity.valid = false;
          }

          for(var key in validity){
            if (validity.hasOwnProperty(key) && key !== "valid" && isBoolean(validity[key]) && validity[key]) {
              validity.validationMessage = ValidityState[key];
              validity.valid = false;
            }
          }

          certified = certified && result;

          validity.valid = certified;

          instance_context._evt.emit(certified ? "valid":"invalid", ruleName, values, validity);
          return certified;

        }, function(reason){
          return (reason);
        }
      )

}


var Validator = function(rules){
  this._rules = rules;
  this._evt = new Events();
};

Validator.prototype.validate = function(data){

  var ME = this;

  return new Promise(function(resolve, reject) {
    var certified = true;
    var pending = 0;

    eachRules(ME._rules, function(ruleName, rule){

      var values = data[ruleName];
      pending ++;

      UniPromise(
        verify(ruleName, rule, values, data, ME),
        function resolved(certify){
          certified = certified && certify;

          if((--pending) === 0){
            ME._evt.emit("complete", certified);

            resolve(certified)
          }
        },
        function(){
          ME._evt.emit("error", ruleName, rule, values, data)
          pending --;
        })
      },
      function(){
        ME._evt.emit("complete", true)
        resolve(true)
      }
    );

  });
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

Validator.rule = function(ruleName, validation){
  if(!isString(ruleName)){return false;}
  if(!isFunction(validation)){return BUILD_IN_RULE[ruleName];}

  BUILD_IN_RULE[ruleName] = validation;
  return true;
};

module.exports = Validator;
