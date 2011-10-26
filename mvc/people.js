define(["require", "jquery", "mvc"], function(require, $, MVC) {
  var mvc = MVC.create(require);

  var personView = mvc.view({
    template: "person",
    events: {
      "click span.select": function() {
        console.log("Selected person:")
        console.log(this.model);
      }
    }
  });

  mvc.extend(personView, { name: "Keith" }).render(function(element) {
    $("#people").append(element);
  });
  mvc.extend(personView, { name: "Roy" }).render(function(element) {
    $("#people").append(element);
  });
  mvc.extend(personView, { name: "Craig" }).render(function(element) {
    $("#people").append(element);
  });
   
});