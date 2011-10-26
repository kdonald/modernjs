define(["jquery"], function($) {
  
  var url = "https://graph.facebook.com/keith.donald";
  
  $("#ajaxButton").on("click", function() {
    $.ajax({
      url: url,
      dataType: "json",
      success: function(user) {
        var result = '<a href="' + user.link + '">' + user.name + '</a>';
        console.log(result);
        $("#ajaxResults").append(result);        
      }
    });    
  });
  
  $("#ajaxButtonDeferred").on("click", function() {
    var xhr = $.ajax({ url: url, dataType: "json" });
    xhr.done(function(user) {
      console.log(user);
      var result = '<a href="' + user.link + '">' + user.name + '</a>';
      $("#ajaxResults").append(result);
    });    
  });

});