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

var ruler = {
  "username": {
    type: "email",
    required: true
  },
  "password": {
    type: "password",
    required: true,
    minlength: 6,
    maxlength: 30
  }
};

var validator = new Validator(ruler);
validator.validate(request.body);
```

## API

### &lt;Validator&gt; Validator(&lt;Object&gt; ruler)

constructor, new a validator by rulers.


### &lt;Boolean&gt; validate(&lt;Object&gt; data)

validate data by rule.
