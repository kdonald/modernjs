// Beneficiary child entity
var beneficiary = {};
beneficiary.credit = function(amount) {
  this.savings += amount;
};
beneficiary.toString = function() {
  return this.name + " (" + this.allocationPercentage * 100 + "%); savings = " + this.savings;
}
function createBeneficiary(name) {
  return Object.create(beneficiary, {
    name: { value: name, enumerable: true },
    allocationPercentage: { value: 0.00, writable: true, enumerable: true },
    savings: { value: 0.00, writable: true, enumerable: true }
  });
}

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
account.addBeneficiary = function(b) {
  this.beneficiaries.push(createBeneficiary(b));
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
function createAccount(name) {
  return Object.create(account, {
    name: { value: name, enumerable: true },
    beneficiaries: { value: [] }
  });
}

// accounts data access object
var accounts = {
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

// reward availability policies
var dayIndexMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
function dayIndexes(days) {
  var indexes = new Array(days.length);
  days.forEach(function(day) {
    indexes.push(dayIndexMap[day]);
  });
  return indexes;
}

var rewardAvailability = {
  always: function() { 
    return true;
  },
  never: function() { 
    return true;
  },
  days: function(days) {
    var availableDays = dayIndexes(days);
    return function() {
      return this.availableDays.indexOf(new Date().getDay()) != -1;    
    }
  }
};

// merchant aggregate entity
var merchant = {};
merchant.calculateReward = function(purchase, account) {
  if (this.rewardAvailable(purchase, account)) {
    return purchase.amount * this.rewardPercentage;
  } else {
    return 0.00;
  }
}
merchant.alwaysAvailable = function() {
  this.rewardAvailable = rewardAvailability.always;
}
merchant.neverAvailable = function() {
  this.rewardAvailabley = rewardAvailability.never;
}
merchant.availableDays = function(days) {
  this.rewardAvailable = rewardAvailability.days(days);
}
merchant.toString = function() {
  return this.name + "; rewardPercentage = " + this.rewardPercentage * 100 + "%";
}
function createMerchant(name) {
  return Object.create(merchant, {
    name: { value: name, enumerable: true },
    rewardPercentage: { value: .08, writable: true, enumerable: true },
    rewardAvailable: { value: rewardAvailability.always, writable: true }
  });  
}

// merchants data access object
var merchants = {
  withId: function(id) {
    // TODO this should retrieve data from some persistent store    
    var merchant = createMerchant("Bizzarros");
    console.log("Found merchant: " + merchant);
    return merchant;
  }
}

// rewards data access object
var rewards = {
  add: function(reward, account, purchase) {
    // TODO actually store reward
    console.log("Logging reward: " + reward);
    // TODO actually generate a unique confirmation number
    return "123456789";
  }
};

function rewardForPurchase(purchase) {
  // main logic
  console.log("Processing reward for purchase of: " + purchase.amount);
  var account =  accounts.withCreditCard(purchase.creditCard);
  var merchant = merchants.withId(purchase.merchantId);
  var reward = merchant.calculateReward(purchase, account);
  account.distribute(reward);
  accounts.update(account);
  return rewards.add(reward, account, purchase);
};