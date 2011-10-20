describe("account", function() {
  it("should be able to reward", function() {
    var keith = rewardnetwork.createAccount("Keith");
    console.log(keith);
    keith.addBeneficiary("Annabelle");
    keith.addBeneficiary("Corgan");
    keith.addBeneficiary("Juliet");
    console.log(keith);
    keith.makeAllocationEven();
    console.log(keith);
    keith.reward(100.00);
    console.log(keith);
  });
});
