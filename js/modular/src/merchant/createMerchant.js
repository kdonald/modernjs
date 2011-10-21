define([], function() {

  // reward availability policies
  var availabilityPolicies = {
    always: {
      test: function() { 
        return true;
      }      
    },
    never: {
      test: function() { 
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
        test: function() {
          return this.availableDays.indexOf(new Date().getDay()) != -1;    
        }
      }
      return function(days) {
        return Object.create(policy, { availableDays: { value: indexes(days) } });        
      }      
    })()
  }

  // merchant aggregate entity
  var merchant = {};
  merchant.calculateReward = function(purchase, account) {
    if (this.availabilityPolicy.test(purchase, account)) {
      return purchase.amount * this.rewardPercentage;
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
  merchant.toString = function() {
    return this.name + "; rewardPercentage = " + this.rewardPercentage * 100 + "%";
  }

  return function(name) {
    return Object.create(merchant, {
      name: { value: name, enumerable: true },
      rewardPercentage: { value: .08, writable: true, enumerable: true },
      availabilityPolicy: { value: availabilityPolicies.always, writable: true }
    });
  }
  
});