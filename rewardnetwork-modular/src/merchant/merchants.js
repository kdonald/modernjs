define(["./createMerchant"], function(createMerchant) {
  return {
    withId: function(id) {
      // TODO this should retrieve data from some persistent store    
      var merchant = createMerchant("Bizzarros");
      console.log("Found merchant: " + merchant);
      return merchant;
    }
  };
});