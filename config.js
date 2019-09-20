const ganache = require("ganache-core");
var Web3 = require("web3");

var config = function () {
    //线上环境
    this.provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    this.defaultAccount = '0x7c8d77649791d9b063d9c9492fd62eeca9aa6577';
    this.mainJsAddress = '0x25469449ccb07b77bb1cfe7d8583542e6248cc07';
    this.mainJsAddressTrack = '0x772e9877ed6477fb6d6ff23a0befe745f8d1d929';

    // 测试环境
    //this.provider = ganache.provider();

}

module.exports = config;