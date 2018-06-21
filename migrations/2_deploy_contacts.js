var Say = artifacts.require("./Say.sol");

module.exports = function(deployer) {
  deployer.deploy(Say);
};
