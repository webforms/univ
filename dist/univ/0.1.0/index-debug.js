define("univ/0.1.0/index-debug", ["moment/2.6.0/moment-debug", "events/1.0.1/events-debug"], function(require, exports, module) {
  var moment = require("moment/2.6.0/moment-debug");
  var events = require("events/1.0.1/events-debug").EventEmitter;
  var BUILD_IN_RULE = {
    isEmail: verifyIsEmail,
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
    isMobile: verifyIsMobile
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
  function typeOf(object, type) {
    return Object.prototype.toString.call(object) === "[object " + type + "]";
  }

  function isString(object) {
    return typeOf(object, "String");
  }

  function isBoolean(object) {
    return typeOf(object, "Boolean");
  }

  function isArray(object) {
    return typeOf(object, "Array");
  }

  function isNumber(object) {
    return !isNaN(object) && typeOf(object, "Number");
  }

  function isRegExp(object) {
    return typeOf(object, "RegExp");
  }

  function isFunction(object) {
    return typeOf(object, "Function");
  }

  function isObject(object) {
    return null !== object && typeOf(object, "Object");
  }
  // @param {Object} rules
  // @param {Function} handler
  function eachRules(rules, handler) {
    for (var ruleName in rules) {
      if (rules.hasOwnProperty(ruleName)) {
        handler.call(rules, ruleName, rules[ruleName]);
      }
    }
  }

  function eachValues(handler, values /* ,... */ ) {
    var certified = true;
    var args = Array.prototype.slice.call(arguments, 0).slice(1);
    if (isArray(values)) {
      for (var i = 0, l = values.length; i < l; i++) {
        args[0] = values[i];
        certified = certified && handler.apply(null, args);
      }
      return certified;
    }
    return handler.apply(null, args);
  }

  function merge( /* ... */ ) {
    var result = {};
    for (var i = 0, object, l = arguments.length; i < l; i++) {
      object = arguments[i];
      if (!isObject(object)) {
        continue;
      }
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          result[key] = object[key]
        }
      }
    }
    return result;
  }

  function startsWith(string, prefix) {
    return isString(string) && string.indexOf(prefix) === 0;
  }

  function endsWith(string, suffix) {
    return isString(string) && string.indexOf(suffix, string.length - suffix.length) !== -1;
  }
  // 通常情况下的 required 校验。
  // @param {Boolean,Undefined} required, is rule required?
  // @param {String,Object} values, validation data.
  // @return {Boolean,Undefined}
  //        if !values and required, return false;
  //        if !values and not-required, return true;
  //        if values, validate passed, and continue next, return undefined.
  function verifyRequired(required, values) {
    if (isArray(values)) {
      if (!verifyMinLengthList(1, values)) {
        return !isBoolean(required) || !required;
      }
    } else {
      if ("undefined" === typeof values || null === values || "" === values) {
        return !isBoolean(required) || !required;
      }
    }
    //!return undefined;
  }

  function verifyIsNumber(value) {
    return /^[+-]?\d+(?:[eE][+-]?\d+)?$/.test(value) || /^[+-]?(?:\d+)?\.\d+(?:[eE][+-]?\d+)?$/.test(value);
  }

  function verifyMin(value, min) {
    return isNaN(min) || Number(value) >= Number(min);
  }

  function verifyMax(value, max) {
    return isNaN(max) || Number(value) <= Number(max);
  }

  function verifyMinLengthList(minlength, values) {
    if (!isNumber(minlength)) {
      return true;
    }
    if (!isArray(values) || values.length < minlength) {
      return false;
    }
    var length = 0;
    for (var i = 0, l = values.length; i < l; i++) {
      if ("undefined" !== typeof values[i] && null !== values[i] && "" !== values[i]) {
        length++;
      }
    }
    return length >= minlength;
  }

  function verifyMaxLengthList(maxlength, values) {
    if (!isNumber(maxlength)) {
      return true;
    }
    if (!isArray(values)) {
      return false;
    }
    var length = 0;
    for (var i = 0, l = values.length; i < l; i++) {
      if ("undefined" !== typeof values[i] && null !== values[i] && "" !== values[i]) {
        length++;
      }
    }
    return length <= maxlength;
  }

  function verifyMinLength(minlength, value) {
    return !isNumber(minlength) || value.length >= minlength;
  }

  function verifyMaxLength(maxlength, value) {
    return !isNumber(maxlength) || value.length <= maxlength;
  }
  var RE_MONTH = /^\d{4,}\-\d{2}$/;

  function verifyIsMonth(value) {
    return RE_MONTH.test(value) && moment(value).isValid();
  }

  function verifyMinMonth(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsMonth(min)) {
      instance_context._evt.emit("error", new TypeError('[type=month][min=' + min + '] is invalid month.'));
      return true;
    }
    return moment(value) >= moment(min);
  }

  function verifyMaxMonth(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsMonth(max)) {
      instance_context._evt.emit("error", new TypeError('[type=month][max=' + max + '] is invalid month.'));
      return true;
    }
    return moment(value) <= moment(max);
  }
  // TODO: #4, remove moment.
  var RE_TIME = /^\d{2}:\d{2}:\d{2}$/;

  function verifyIsTime(value) {
    return RE_TIME.test(value) && moment("2014-01-01 " + value).isValid();
  }

  function verifyMinTime(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsTime(min)) {
      instance_context._evt.emit("error", new TypeError('[type=time][min=' + min + '] is invalid time.'));
      return true;
    }
    var date = '2014-01-01T';
    return moment(date + value) >= moment(date + min);
  }

  function verifyMaxTime(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsTime(max)) {
      instance_context._evt.emit("error", new TypeError('[type=time][max=' + max + '] is invalid time.'));
      return true;
    }
    var date = '2014-01-01T';
    return moment(date + value) <= moment(date + max);
  }
  var RE_DATE = /^\d{4,}\-\d{2}\-\d{2}$/;

  function verifyIsDate(value) {
    return RE_DATE.test(value) && moment(value).isValid();
  }

  function verifyMinDate(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsDate(min)) {
      instance_context._evt.emit("error", new TypeError('[type=date][min=' + min + '] is invalid date.'));
      return true;
    }
    return moment(value) >= moment(min);
  }

  function verifyMaxDate(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsDate(max)) {
      instance_context._evt.emit("error", new TypeError('[type=date][max=' + max + '] is invalid date.'));
      return true;
    }
    return moment(value) <= moment(max);
  }
  // http://www.w3.org/TR/html-markup/input.datetime.html
  var RE_DATETIME = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;

  function verifyIsDateTime(value) {
    return RE_DATETIME.test(value) && moment(value).isValid();
  }

  function verifyMinDateTime(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsDateTime(min)) {
      instance_context._evt.emit("error", new TypeError('[type=datetime][min=' + min + '] is invalid datetime.'));
      return true;
    }
    return moment(value) >= moment(min);
  }

  function verifyMaxDateTime(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsDateTime(max)) {
      instance_context._evt.emit("error", new TypeError('[type=datetime][max=' + max + '] is invalid datetime.'));
      return true;
    }
    return moment(value) <= moment(max);
  }
  // [input=type=datetime-local](http://www.w3.org/TR/html-markup/input.datetime-local.html)
  var RE_DATETIME_LOCAL = /^\d{4,}\-\d\d\-\d\dT\d\d:\d\d:\d\d(?:[+-]\d\d:\d\d)?Z?$/;

  function verifyIsDateTimeLocal(value) {
    return RE_DATETIME_LOCAL.test(value) && moment(value).isValid();
  }

  function verifyMinDateTimeLocal(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsDateTimeLocal(min)) {
      instance_context._evt.emit("error", new TypeError('[type=datetime-local][min=' + min + '] is invalid datetime.'));
      return true;
    }
    return moment(value) >= moment(min);
  }

  function verifyMaxDateTimeLocal(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsDateTimeLocal(max)) {
      instance_context._evt.emit("error", new TypeError('[type=datetime-local][max=' + max + '] is invalid datetime.'));
      return true;
    }
    return moment(value) <= moment(max);
  }
  var RE_WEEK = /^\d{4,}-W\d{2}$/;

  function verifyIsWeek(value) {
    return RE_WEEK.test(value) && moment(value).isValid();
  }

  function verifyMinWeek(value, min, instance_context) {
    if (!min) {
      return true;
    }
    if (!verifyIsWeek(min)) {
      instance_context._evt.emit("error", new TypeError('[type=week][min=' + min + '] is invalid week.'));
      return true;
    }
    return moment(value) >= moment(min);
  }

  function verifyMaxWeek(value, max, instance_context) {
    if (!max) {
      return true;
    }
    if (!verifyIsWeek(max)) {
      instance_context._evt.emit("error", new TypeError('[type=week][max=' + max + '] is invalid week.'));
      return true;
    }
    return moment(value) <= moment(max);
  }
  // [RFC1738](http://www.faqs.org/rfcs/rfc1738.html)
  var RE_URL = /^https?:\/\/(?:[\w.-]*(?::[^@]+)?@)?(?:[\w-]+\.){1,3}[\w]+(?::\d+)?(?:\/.*)?$/;

  function verifyIsUrl(value) {
    return RE_URL.test(value);
  }
  var RE_EMAIL = /^\w+(?:[\._+\-]\w+)*@\w+(?:\.\w+)+$/;

  function verifyIsEmail(value) {
    return RE_EMAIL.test(value);
  }
  var RE_MOBILE = /^(?:13[0-9]|14[57]|15[0-35-9]|170|18[0-9])\d{8}$/;

  function verifyIsMobile(value) {
    return RE_MOBILE.test(value);
  }
  var RE_TEL = /^(?:\(\+\d{2}\))?\d{3,4}\-\d{7,8}$/;

  function verifyIsTel(value) {
    return RE_TEL.test(value);
  }
  var RE_COLOR = /^#[0-9a-fA-F]{6}$/;

  function verifyIsColor(value) {
    return RE_COLOR.test(value);
  }

  function verifyPattern(pattern, value, instance_context) {
    if (!isRegExp(pattern)) {
      if (!isString(pattern)) {
        return true;
      }
      try {
        pattern = new RegExp(pattern);
      } catch (ex) {
        instance_context._evt.emit("error", ex);
        return true;
      }
    }
    return pattern.test(value);
  }

  function verifyPatternList(pattern, values, instance_context) {
    var certified = true;
    for (var i = 0, l = values.length; i < l; i++) {
      certified = certified && verifyPattern(pattern, values[i], instance_context);
    }
    return certified;
  }

  function verifyFunction(ruleFunction, value, datas, certifiedCallback) {
    if (!isFunction(ruleFunction)) {
      return true;
    }
    var build_in_rule = merge(BUILD_IN_RULE, {
      data: function(key) {
        return datas[key];
      }
    });
    var result = ruleFunction.call(build_in_rule, value, certifiedCallback);
    if ("undefined" !== typeof result) {
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

  function typeByName(fileName) {
    var ext = fileName.split(".").slice(-1);
    if (MIME_TYPE.hasOwnProperty(ext)) {
      return MIME_TYPE[ext];
    }
  }
  // @param {Array} accept.
  // @param {File} file.
  // @return {Boolean}
  function verifyFileType(file, accept) {
    if (!isArray(accept) || !file || !file.name) {
      return true;
    }
    for (var i = 0, l = accept.length; i < l; i++) {
      if (!file.type) {
        file.type = typeByName(file.name);
      }
      if (accept[i] === file.type) {
        return true;
      } else if (endsWith(accept[i], "/*") && startsWith(file.type, accept[i].replace(/\*$/, ""))) {
        return true;
      }
    }
    return false;
  }

  function verifyMinFileSize(file, min) {
    if (!isNumber(min) || !isNumber(file.size)) {
      return true;
    }
    return file.size >= min;
  }

  function verifyMaxFileSize(file, max) {
    if (!isNumber(max) || !isNumber(file.size)) {
      return true;
    }
    return file.size <= max;
  }

  function verify(ruleName, rule, values, datas, instance_context) {
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
    if ("undefined" !== typeof resultRequired) {
      return resultRequired;
    }
    if (isArray(values)) {
      certified = certified && verifyMinLengthList(rule.minlength, values) && verifyMaxLengthList(rule.maxlength, values) && verifyPatternList(rule.pattern, values, instance_context);
    } else {
      certified = certified && verifyMinLength(rule.minlength, values) && verifyMaxLength(rule.maxlength, values) && verifyPattern(rule.pattern, values, instance_context);
    }
    // rule: type, min, max.
    switch (rule.type) {
      case RULE_TYPES.number:
      case RULE_TYPES.range:
        certified = certified && eachValues(verifyIsNumber, values) && eachValues(verifyMin, values, rule.min) && eachValues(verifyMax, values, rule.max);
        break;
      case RULE_TYPES.date:
        certified = certified && eachValues(verifyIsDate, values) && eachValues(verifyMinDate, values, rule.min, instance_context) && eachValues(verifyMaxDate, values, rule.max, instance_context);
        break;
      case RULE_TYPES.datetime:
        certified = certified && eachValues(verifyIsDateTime, values) && eachValues(verifyMinDateTime, values, rule.min, instance_context) && eachValues(verifyMaxDateTime, values, rule.max, instance_context);
        break;
      case RULE_TYPES["datetime-local"]:
        certified = certified && eachValues(verifyIsDateTimeLocal, values) && eachValues(verifyMinDateTimeLocal, values, rule.min, instance_context) && eachValues(verifyMaxDateTimeLocal, values, rule.max, instance_context);
        break;
      case RULE_TYPES.time:
        certified = certified && eachValues(verifyIsTime, values) && eachValues(verifyMinTime, values, rule.min, instance_context) && eachValues(verifyMaxTime, values, rule.max, instance_context);
        break;
      case RULE_TYPES.week:
        certified = certified && eachValues(verifyIsWeek, values) && eachValues(verifyMinWeek, values, rule.min, instance_context) && eachValues(verifyMaxWeek, values, rule.max, instance_context);
        break;
      case RULE_TYPES.month:
        certified = certified && eachValues(verifyIsMonth, values) && eachValues(verifyMinMonth, values, rule.min, instance_context) && eachValues(verifyMaxMonth, values, rule.max, instance_context);
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
        certified = certified && eachValues(verifyFileType, values, rule.accept) && eachValues(verifyMinFileSize, values, rule.min) && eachValues(verifyMaxFileSize, values, rule.max);
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
    var result = verifyFunction(rule.custom, values, datas, function(certified) {
      instance_context._evt.emit(certified ? "valid" : "invalid", ruleName, values, validity);
      if (--instance_context._pending === 0) {
        instance_context._evt.emit("complete", instance_context._certified && certified);
        instance_context._certified = true;
      }
    });
    instance_context._certified = certified;
    if (typeof result !== "undefined") {
      certified = certified && result;
      instance_context._evt.emit(certified ? "valid" : "invalid", ruleName, values, validity);
      return certified;
    } else {
      instance_context._pending++;
    }
  }
  var Validator = function(rules) {
    this._rules = rules;
    this._evt = new events();
    this._pending = 0;
    this._certified = true;
  };
  Validator.prototype.validate = function(data) {
    var certified = true;
    var ME = this;
    eachRules(this._rules, function(ruleName, rule) {
      var values = data[ruleName];
      var result = verify(ruleName, rule, values, data, ME);
      certified = certified && result;
    });
    if (this._pending === 0) {
      ME._evt.emit("complete", certified);
      ME._certified = true;
    }
    return this;
  };
  Validator.prototype.on = function(eventName, handler) {
    this._evt.on(eventName, handler);
    return this;
  };
  Validator.prototype.off = function(eventName, handler) {
    if (isFunction(handler)) {
      this._evt.removeListener(eventName, handler);
    } else {
      this._evt.removeAllListeners(eventName);
    }
    return this;
  };
  Validator.rule = function(ruleName, validation) {
    if (!isString(ruleName)) {
      return false;
    }
    if (!isFunction(validation)) {
      return BUILD_IN_RULE[ruleName];
    }
    BUILD_IN_RULE[ruleName] = validation;
    return true;
  };
  module.exports = Validator;
});