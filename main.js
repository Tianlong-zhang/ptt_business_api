
var express = require('express');
var Web3 = require("web3")
var net = require("net")
var http = require("http")

var web3 = new Web3(new Web3.providers.HttpProvider("http://47.96.117.14:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

var abi = [{"constant":false,"inputs":[{"name":"_msg","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];

var address = '0xaaa71c94e9daacabb740cb4730fbd6706072e2bd';
var contract = new web3.eth.Contract(abi,address);

var app = express();
 
app.get('/', function (req, res) {
	var result = contract.methods.say().call().then(function(result){
		res.send(result);
	});
})

//POST 请求
app.post('/api/v1/users_upload', function (req, res) {

	console.log("主页 POST 请求");
	res.send('Hello POST');

})
 
var server = app.listen(8888, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("访问地址为 http://%s:%s", host, port)
})
