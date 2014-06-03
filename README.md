# Universal Validator

---

[![NPM version](https://badge.fury.io/js/univalidator.png)](http://badge.fury.io/js/univalidator)
[![spm package](http://spmjs.io/badge/univalidator)](http://spmjs.io/package/univalidator)
[![Build Status](https://secure.travis-ci.org/webforms/univalidator.png?branch=master)](https://travis-ci.org/webforms/univalidator)
[![Coverage Status](https://coveralls.io/repos/webforms/univalidator/badge.png?branch=master)](https://coveralls.io/r/webforms/univalidator)

Universal Validator.

---

## Install

via spm@3.x:

```
$ spm install univalidator
```

via npm:

```
$ npm install univalidator
```

## Usage

```js
var Validator = require('univalidator');

var rules = {
  "username": {
    type: "email",
    required: true,

    // @param {String} value.
    // @param {Function} certifiedCallback, optional.
    script: function(value, certifiedCallback){
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
    }
  },
  "password": {
    type: "password",
    required: true,
    minlength: 6,
    maxlength: 30
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

### &lt;Validator&gt; Validator(&lt;Object&gt; ruler)

constructor, new a validator by rulers.


### &lt;Validator&gt; validate(&lt;Object&gt; data)


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
