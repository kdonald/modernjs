// Object.create is key primitive object creation function
// full-power now exposed to developers in ECMAScript 5
// {} is syntax sugar for Object.create(Object.prototype);
var obj = {}, obj2 = Object.create(Object.prototype); // equivalent

var user = (function() {
  // private function declared inside 'module' scope
  function encode(password) { return "!" + password + "!"; }
  // public object returned that callers can invoke
  return {
    authenticate: function(password) {
      return encode(password) === this.encodedPassword;
    },
    // overrides Object.toString();    
    toString: function() { return this.username; }
  };
})();

// 'keith' is created with 'user' as his prototype
// keith's property values are referenced by prototype methods using 'this'
// Since ECMA5, you have full control over property descriptor definition
//   e.g. enumerable/writable/configurable
var keith = Object.create(user, {
  username: { value: "kdonald", enumerable: true } ,
  encodedPassword: { value: "!melbourne!" }
});
console.log(keith);

// authenticate can be invoked since it's a function defined on keith.prototype
// JS will look first for 'authenticate' on this object, then the prototype
console.log(keith.authenticate("melbourne"));
console.log(keith.authenticate("notit"));