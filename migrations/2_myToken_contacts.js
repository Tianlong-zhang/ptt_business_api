var myToken = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(myToken);
};
