// Beneficiary child entity
var beneficiary = Object.create(Object.prototype);
beneficiary.credit = function(amount) {
  this.savings += amount;
};
beneficiary.toString = function() {
  return this.name + " (" + this.allocationPercentage * 100 + "%); savings = " + this.savings;
}
createBeneficiary = function(name) {
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
  this.beneficiaries.push(b);
}
account.makeAllocationEven = function() {
  var even = 100 / this.beneficiaries.length / 100;
  this.beneficiaries.forEach(function(b) {
    b.allocationPercentage = even;
  });
}
account.reward = function(reward) {
  this.beneficiaries.forEach(function(b) {
    b.credit(reward * b.allocationPercentage);
  });  
}
account.toString = function() {
  return this.name + "; totalSavings = " + this.totalSavings + ", beneficiaries = " + this.beneficiaries;
}
createAccount = function(name) {
  return Object.create(account, {
    name: { value: name, enumerable: true },
    beneficiaries: { value: [] }
  });
}

// always reward availability policy
var always = {
  test: function(receipt) { 
    return true;
  }
}

// never reward availability policy
var never = {
  test: function(receipt) { 
    return false;
  }
}

// days of week reward availability policy
var indexMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
function indexes(days) {
  var indexes = new Array(days.length);
  days.forEach(function(day) {
    indexes.push(indexMap[day]);
  });
  return indexes;
}
var daysOfWeek = {
  test: function(receipt) {
    return this.availableDays.indexOf(new Date().getDay()) != -1;    
  }
};
var createDaysOfWeek = function(days) {
  return Object.create(daysOfWeek, { availableDays: { value: indexes(days) } });
}

// merchant aggregate entity

var merchant = Object.create(Object.prototype);
merchant.calculateReward = function(receipt) {
  if (this.availabilityPolicy.test(receipt)) {
    return receipt.amount * this.rewardPercentage;
  } else {
    return 0.00;
  }
}
var createMerchant = function(name) {
  return Object.create(merchant, {
    name: { value: name, enumerable: true },
    rewardPercentage: { value: .08, writable: true, enumerable: true },
    availabilityPolicy: { value: always, writable: true }
  });  
}

