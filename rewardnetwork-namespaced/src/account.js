var rewardnetwork = rewardnetwork || {};
rewardnetwork.internal = rewardnetwork.internal || {};

rewardnetwork.internal.accounts = {
  withCreditCard: function(creditCard) {
    // TODO this should retrieve data from some persistent store
    var account = rewardnetwork.internal.createAccount("Keith Donald").addBeneficiary("Annabelle").addBeneficiary("Corgan").addBeneficiary("Juliet").makeAllocationEven();
    console.log("Found account: "  + account);
    return account;
  },
  update: function(account) {
    // TODO this should save data to some persistent store
    console.log("Updating account: " + account);
  }
}

rewardnetwork.internal.createAccount = (function() {
  
  var createBeneficiary = (function() {
    // Beneficiary child entity
    var beneficiary = {};
    beneficiary.credit = function(amount) {
      this.savings += amount;
    };
    beneficiary.toString = function() {
      return this.name + " (" + this.allocationPercentage * 100 + "%); savings = " + this.savings;
    }
    return function(name) {
      return Object.create(beneficiary, {
        name: { value: name, enumerable: true },
        allocationPercentage: { value: 0.00, writable: true, enumerable: true },
        savings: { value: 0.00, writable: true, enumerable: true }
      });
    }
  })();

  // Account aggregate entity
  var account = Object.create(Object.prototype, {
    totalSavings: {
      get: function() {
        var total = 0.00;
        this.beneficiaries.forEach(function(b) {
          total += b.savings;
        });
        return total;      
      }
    }
  });
  account.addBeneficiary = function(name) {
    this.beneficiaries.push(createBeneficiary(name));
    return this;
  }
  account.makeAllocationEven = function() {
    var even = 100 / this.beneficiaries.length / 100;
    this.beneficiaries.forEach(function(b) {
      b.allocationPercentage = even;
    });
    return this;
  }
  account.distribute = function(reward) {
    this.beneficiaries.forEach(function(b) {
      b.credit(reward * b.allocationPercentage);
    });  
  }
  account.toString = function() {
    return this.name + "; totalSavings = " + this.totalSavings + ", beneficiaries = " + this.beneficiaries;
  }
    
  return function(name) {
    return Object.create(account, {
      name: { value: name, enumerable: true },
      beneficiaries: { value: [] }
    });
  }
  
})();