var pool = artifacts.require("./Pool.sol");

module.exports = function(deployer) {
  deployer.deploy(pool);

};
