var pool = artifacts.require("./Pool.sol");
var Permission = artifacts.require("./Permission.sol");

module.exports = function(deployer) {
  deployer.deploy(pool);
  deployer.deploy(Permission);
};
