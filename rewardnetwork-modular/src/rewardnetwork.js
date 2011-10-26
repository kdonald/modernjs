define(["account/accounts", "merchant/merchants", "reward/rewards"], function(accounts, merchants, rewards) {
  return {
    rewardForPurchase: function(purchase) {
      var account =  accounts.withCreditCard(purchase.creditCard);
      var merchant = merchants.withId(purchase.merchantId);
      var reward = merchant.calculateReward(purchase, account);
      account.distribute(reward);
      accounts.update(account);
      return rewards.add(reward, account, purchase);
    }
  };
});