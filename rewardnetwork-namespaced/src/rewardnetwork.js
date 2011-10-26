var rewardnetwork = rewardnetwork || {};

rewardnetwork.rewardForPurchase = function(purchase) {
  // local vars for convenience
  var accounts = rewardnetwork.internal.accounts, merchants = rewardnetwork.internal.merchants, rewards = rewardnetwork.internal.rewards;
  // main logic
  console.log("Processing reward for purchase of: " + purchase.amount);
  var account =  accounts.withCreditCard(purchase.creditCard);
  var merchant = merchants.withId(purchase.merchantId);
  var reward = merchant.calculateReward(purchase, account);
  account.distribute(reward);
  accounts.update(account);
  return rewards.add(reward, account, purchase);
};