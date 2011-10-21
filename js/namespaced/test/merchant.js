describe("merchant", function() {
  it("should be able to calculate reward", function() {
    var bizzaros = rewardnetwork.createMerchant("Bizzarros");
    var reward = bizzaros.calculateReward({ amount: "30.00" });
    console.log(reward);
    
    var medievalTimes = rewardnetwork.createMerchant("Medieval Times");
    medievalTimes.availableDays(["Mon", "Wed"]);
    reward = medievalTimes.calculateReward({ amount: "179.00" });
    console.log(reward);
    
  });
});
