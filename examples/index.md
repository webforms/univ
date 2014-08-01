# Demo

---

## Normal usage

````javascript
seajs.use('index', function(Univ){

  var rule = {};
  var data = {};
  var valid = new Univ(rule);
  valid.validate(data);

});
````
