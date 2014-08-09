# Universal Validator

---

[![NPM version](https://badge.fury.io/js/univ.png)](http://badge.fury.io/js/univ)
[![spm package](http://spmjs.io/badge/univ)](http://spmjs.io/package/univ)
[![Build Status](https://secure.travis-ci.org/webforms/univ.png?branch=master)](https://travis-ci.org/webforms/univ)
[![Coverage Status](https://coveralls.io/repos/webforms/univ/badge.png?branch=master)](https://coveralls.io/r/webforms/univ)

Universal Validator.

---

## Install

via spm@3.x:

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

    // @param {String} value.
    // @param {Function} certifiedCallback, optional.
    custom: function(value, certifiedCallback){
      $.ajax({
        url: "/check-username-available",
        data: "username="+value,
        success: function(data){
          if(data.state === "ok" && data.available = "yes"){
            callback(true);
          }else{
            certifiedCallback(false);
          }
        },
        error: function(){
          certifiedCallback(false);
        }
      });

      //!return undefined;

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
    custom: function(value, callback){
      return value === this.data("password");
    }
  }
};

var validator = new Validator(rules);
validator.validate({
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
      text,password,
      radio,checkbox,
      select-one,select-multiple,
      search,textarea,
      number,range,
      date,week,month,time,datetime,datetime-local,
      email,url,tel,color,
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
validator.rule("isBankCard", function(values, callback){
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
