// we can create functions anywhere
var sayHello = function(name) {
  return "hello " + name;
}

// functions can accept other functions as arguments
function logResultOf(fx, arg) {
  console.log(fx.call(null, arg));
}
// we can pass functions around
logResultOf(sayHello, "keith");

// we can compose functions together
["roy", "craig"].forEach(function(name) {
  logResultOf(sayHello, name);
});