# Demo

---

````javascript
seajs.use('index', function(Univ){

  var rule = {
    username: {
      required: true
    }
  };
  var data = {};

  var univ = new Univ(rule).on("valid", function(){
      console.log("valid")
    }).on("invalid", function(){
      console.log("invalid")
    }).on("complete", function(certified){
      console.log("complete", certified)
    })

  univ.validate(data);

});
````
