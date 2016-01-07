# Universal Validator

---

[![NPM version](https://badge.fury.io/js/univ.png)](https://www.npmjs.com/package/univ)
[![spm package](http://spmjs.io/badge/univ)](http://spmjs.io/package/univ)
[![Build Status](https://secure.travis-ci.org/webforms/univ.png?branch=master)](https://travis-ci.org/webforms/univ)
[![Coverage Status](https://coveralls.io/repos/webforms/univ/badge.png?branch=master)](https://coveralls.io/r/webforms/univ)

Universal Validator.

---

## Install

via spm:

```
$ spm install univ
```

via npm:

```
$ npm install univ
```

## Usage

```js
var Validator = require('univ');

var rules = {
  "username": {
    type: "email",
    required: true,
    custom: function(value){
      // Async validate.
      return new Promise(function(resolve, reject){
          $.post("/check-username-available", {username:value}, function(result) {
            resolve(result.available === "YES")
          }, "json")
      })
    }
  },
  "password": {
    type: "password",
    required: true,
    minlength: 6,
    maxlength: 30
  },
  "re-password": {
    type: "password",
    required: true,
    minlength: 6,
    maxlength: 30,
    custom: function(value){
      // Sync validate.
      return value === this.data("password");
    }
  }
};

var validator = new Validator(rules);
var result = yield validator.validate({
  "username": "hotoo@email.address",
  "password": "PassWord",
  "checkbox": ["check-0", "check-1"]
});
```

## API

### Validator(ruler)

constructor, new a validator by rulers.

```js
{
  // rule name.
  "name": {
    type: {TypeEnum(
      text,password, search,textarea,
      radio,checkbox,
      select-one,select-multiple,
      number,range, email,url,tel,color,
      date,week,month,time,datetime,datetime-local,
      file,
      submit,button,image,
      hidden
    )},
    required: {Boolean},
    max: {Number},
    min: {Number},
    maxlength: {Number},
    minlength: {Number},
    pattern: {RegExp},
    multiple: {Boolean},
    step: {Number},
    accept: {Array<String>},
    custom: {Function}
  },
  "other-name": {
    // ...
  },
  // ...
}
```


### Univ.rule(name, rule)

Set or get a custom rule.

```js
validator.rule("isBankCard", function(values){
  return true;
});
```


### univ.validate(data)

data:

```js
univ.validate(
  {
    "name": "value",
    "other-name": ["item-1", "item-2"],
    // ...
  }
);
```

## Rule

### {Boolean} required

Set field is required or not.

### {String} type

Set field type, type value is a enum list(same html5 type):

* text
* password
* search
* textarea
* radio
* checkbox
* select-one
* select-multiple
* number
* range
* email
* url
* tel
* color
* date
* week
* month
* time
* datetime
* datetime-local
* file
* submit
* button
* image
* hidden

### {Number} min

* For `[type=number]`, input data must be great than the min value.
* For `[type=date]` and so on, input data

## Events

### valid

单个数据项通过校验，数据合法有效。

```js
validator.on("valid", function(name, value, validity){
  console.log("Field [name=" + name + "] Passed.");
});
```

### invalid

单个数据项未通过校验，数据无效、不合法。

```js
validator.on("valid", function(name, value, validity){
  console.log("Field [name=" + name + "] Failed.");
});
```

### complete

所有数据校验完成。数据是否全部通过校验，则视事件处理函数的对应参数。

```js
// @param {Boolean} certified.
validator.on("complete", function(certified){
  console.log("Form validation", certified ? "Passed" : "Failed");
});
```

### error

校验过程中出现异常，则抛出 `error` 事件。

```js
// @param {Error} error
validator.on("error", function(error){
});
```
