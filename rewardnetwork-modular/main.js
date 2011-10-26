require.config({
  baseUrl: "src"
});
require(["rewardnetwork"], function(rewardnetwork) {
  window.rewardnetwork = rewardnetwork;
});