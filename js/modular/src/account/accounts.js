define(["./createAccount"], function(createAccount) {
  return {
    withCreditCard: function(creditCard) {
      // TODO this should retrieve data from some persistent store
      var account = createAccount("Keith Donald").addBeneficiary("Annabelle").addBeneficiary("Corgan").addBeneficiary("Juliet").makeAllocationEven();
      console.log("Found account: "  + account);
      return account;
    },
    update: function(account) {
      // TODO this should save data to some persistent store
      console.log("Updating account: " + account);
    }
  };
});