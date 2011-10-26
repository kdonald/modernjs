var User = function(name) {
  this.name = name;
}
User.prototype.awesome = true;

var keith = new User("keith");
var roy = new User("roy");
console.log(keith);
console.log(roy);

// new operator psudocode
function psudoNew(initializer, args) {
  var obj = Object.create(initializer.prototype);
  initializer.apply(obj, args);
  return obj;
}
var craig = psudoNew(User, ["craig"]);

console.log(craig);