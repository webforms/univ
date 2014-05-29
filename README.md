# Universal Validator

---

[![spm version](http://spmjs.io/badge/uv)](http://spmjs.io/package/uv)

Universal Validator.

---

## Install

via spm@3.x:

```
$ spm install uv --save
```

via npm:

```
$ npm install uv
```

## Usage

```js
var Validator = require('uv');

var rules = {
  "username": {
    type: "email",
    required: true,

    // @param {String} value.
    // @param {Function} certifiedCallback, optional.
    script: function(value, certifiedCallback){
      $.ajax({
        url: "/checkUserNameAvailable",
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
validator.validate(request.body);
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

validate data by rule.
