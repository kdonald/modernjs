var fx = function() {
  console.log("fx function invoked");
  console.log(this);
}
fx(); // this === window

var obj = { name: "keith" };
obj.property = fx;
obj.property(); // this === obj

// jQuery(“#myDiv”).click(fx); // on click, this === myDiv

// key Function primitives - ‘obj’ becomes ‘this’ when ‘fx’ is invoked
fx.call(obj, "arg1", "arg2", "...");
fx.apply(obj, ["arg1", "arg2", "..."]);