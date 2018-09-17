var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require("web3");

const axios = require("axios")
const ipfsFile = require('./ipfsFile');

web3 = new Web3(new Web3.providers.HttpProvider("http://47.96.117.14:8545"));  
//web3.eth.defaultAccount = web3.eth.accounts[0];

var abi=[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dataid","type":"uint256"},{"indexed":false,"name":"hashid","type":"uint256"}],"name":"UploadEvent","type":"event"},{"constant":false,"inputs":[{"name":"dataid","type":"uint256"},{"name":"hash","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashid","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHashCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

var address = '0xb480127414e9a330b8d6bb8ff55f4f915bed1615';

var pool_contract = web3.eth.contract(abi);
var pool = pool_contract.at(address);

var app = express();
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({           
  extended: true
}));


var upload = pool.UploadEvent();
upload.watch(function(error, result) {
	if (!error)
	{
			console.log("dataid: " + result.args.dataid);
			console.log("hashid: " + result.args.hashid);

	} else {
		console.log(error);
	}
});



