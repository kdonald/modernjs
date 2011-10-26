define(["jquery","handlebars"], function($, handlebars) {

  var template = handlebars.compile($("#template").html());
  
  $("#templatingButton").on("click", function() {
    var user = {
      name: "Keith Donald",
      link: "http://twitter.com/kdonald"
    };
    $("#templatingResults").html(template(user));
  });
  
});