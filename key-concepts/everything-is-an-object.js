// basic object literal syntax
var obj = {};
console.log(obj instanceof Object);

// arrays are objects, too
console.log([] instanceof Object);

// functions are objects, too!
console.log((function() {}) instanceof Object);

// objects are like maps, can have properties
obj.property = "foo";

// a property can be a function
obj.method = function() {  
  console.log(this);
  return "bar";
}

// when a function is called in the context of an object,
// 'this' equals the object
console.log(obj.method());