var rewardnetwork = rewardnetwork || {};

// without immediately-executing function expressions we'd re-create obj structures on each invocation - not efficient
rewardnetwork.createMerchant = (function() {
      
  // reward availability policies
  var availabilityPolicies = {
    always: {
      test: function(receipt) { 
        return true;
      }      
    },
    never: {
      test: function(receipt) { 
        return true;
      }      
    },
    days: (function() {
      var indexMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
      function indexes(days) {
        var indexes = new Array(days.length);
        days.forEach(function(day) {
          indexes.push(indexMap[day]);
        });
        return indexes;
      }
      var policy = {
        test: function(receipt) {
          return this.availableDays.indexOf(new Date().getDay()) != -1;    
        }
      }
      return function(days) {
        return Object.create(policy, { availableDays: { value: indexes(days) } });        
      }      
    })()
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
  merchant.alwaysAvailable = function() {
    this.availabilityPolicy = availabilityPolicies.always;
  }
  merchant.neverAvailable = function() {
    this.availabilityPolicy = availabilityPolicies.never;
  }
  merchant.availableDays = function(days) {
    this.availabilityPolicy = availabilityPolicies.days(days);
  }

  return function(name) {
    return Object.create(merchant, {
      name: { value: name, enumerable: true },
      rewardPercentage: { value: .08, writable: true, enumerable: true },
      availabilityPolicy: { value: availabilityPolicies.always, writable: true }
    });
  }
  
})();