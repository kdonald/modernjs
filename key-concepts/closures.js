// functions create scope in JavaScript
// can return other functions that "hide" local data
var sayHelloMaker = function(name) {
  // creates a new function bound to the local var 'name'
  return function() {
    return  "hello " + name;
  }
}
var helloKeith = sayHelloMaker("keith"), helloRoy = sayHelloMaker("roy");
console.log(helloKeith());
console.log(helloRoy());

// JavaScript module pattern
// An immediately-executing function that creates a scope for private data &
// returns an object exposing public behavior that can see that private data
var obj = (function() {
  var priv = "value";
  return {
    pub: function() { 
      console.log("Called public function that can see private data: " + priv);
    }
  };
})();
console.log(obj.pub());
// undefined, as 'priv' is not a property of the returned obj;
console.log(obj.priv);