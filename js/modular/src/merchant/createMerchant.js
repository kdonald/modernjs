define([], function() {

  // reward availability policies
  var rewardAvailability = {
    always: function() { 
        return true;
    },
    never: function() { 
        return true;
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
      return function(days) {
        var availableDays = indexes(days);
        return function() {
          return availableDays.indexOf(new Date().getDay()) != -1;
        }
      }      
    })()
  }

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
    return this;
  }
  merchant.neverAvailable = function() {
    this.rewardAvailable = rewardAvailability.never;
    return this;
  }
  merchant.availableDays = function(days) {
    this.rewardAvailable = rewardAvailability.days(days);
    return this;
  }
  merchant.toString = function() {
    return this.name + "; rewardPercentage = " + this.rewardPercentage * 100 + "%";
  }

  return function(name) {
    return Object.create(merchant, {
      name: { value: name, enumerable: true },
      rewardPercentage: { value: .08, writable: true, enumerable: true },
      rewardAvailable: { value: rewardAvailability.always, writable: true }
    });
  }
  
});