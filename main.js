var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require("web3");

const axios = require("axios")
const ipfsFile = require('./ipfsFile');

//web3 = new Web3(new Web3.providers.HttpProvider("http://47.96.117.14:7445"));  
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));  
//web3.eth.defaultAccount = web3.eth.accounts[0];
web3.eth.defaultAccount = '0x7c8d77649791d9b063d9c9492fd62eeca9aa6577';

var abi=[{"constant":false,"inputs":[{"name":"dataid","type":"uint256"},{"name":"hash","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashid","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHashCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dataid","type":"uint256"},{"indexed":false,"name":"hashid","type":"uint256"}],"name":"UploadEvent","type":"event"}];

var abi_track=[{"constant":false,"inputs":[{"name":"dataid","type":"uint256"},{"name":"hash","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashid","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHashCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dataid","type":"uint256"},{"indexed":false,"name":"hashid","type":"uint256"}],"name":"UploadEvent","type":"event"}];


var address = '0x25469449ccb07b77bb1cfe7d8583542e6248cc07';
var address_track = '0x772e9877ed6477fb6d6ff23a0befe745f8d1d929';

var pool_contract = web3.eth.contract(abi);
var pool = pool_contract.at(address);

var pool_contract_track = web3.eth.contract(abi_track);
var pool_track = pool_contract_track.at(address_track);


var app = express();
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({           
  extended: true
}));

app.post('/track', function (req, res) {

	//上传ipfs
	let buff = Buffer.from(JSON.stringify(req.body.content));
	ipfsFile.add(buff).then((rhash)=>{
		//console.log('ipfs upload success');
		//console.log('ipfs hash: ' + rhash);
		//console.log('ipfs address: http://ipfs.analytab.net/ipfs/' + rhash);
        console.log('ipfs address: http://localhost/ipfs/' + rhash);
		var hash = '';
			
		var account_status = web3.personal.unlockAccount("0x7c8d77649791d9b063d9c9492fd62eeca9aa6577", 'ptt123456');
		if (account_status) {
		//	console.log('unlock success');	
		}

		pool_track.upload.sendTransaction(req.body.dataid, rhash, {gas:200000}, function(error, result) {
			hash = result;
			res.send(hash.toString());
		});
		
		var upload = pool_track.UploadEvent();
		upload.watch(function(error, result) {
			if (!error) {
					//console.log("dataid: " + result.args.dataid);
					//console.log("txhash: " + result.transactionHash);

					axios.post('http://ums.proton.global/api/v1/track_node_call',  {
								txhash: result.transactionHash,
								dataid: result.args.dataid,
					}).then(function(response){
					//	console.log('success');
					}).catch(function(err){
						console.log(err);
					});
			} else {
				console.log(error);
			}
		});

	}).catch((err)=>{
		console.log(err);
	})

});

app.get('/track/:summaryid', function (req, res) {
	var dataid = req.params.summaryid;
	pool_track.getHash(dataid, function(error, result){
	    if(!error)
	    {
			res.send(result.toString());
		} else {
			console.error(error);
		}
	});

});




//创建账号
app.post('/account', function (req, res) {
	var phone = req.body.phone; //电话
	var password = req.body.password; //电话+随机数
	var account_new = web3.personal.newAccount(password);
	if (account_new) {
		res.send({"phone": phone, "password": password, "address": account_new});
	}
});


app.post('/upload', function (req, res) {

	console.log(req.body);

	//上传ipfs
	let buff = Buffer.from(JSON.stringify(req.body.hash));
	ipfsFile.add(buff).then((rhash)=>{
		console.log('ipfs upload success');
		console.log('ipfs hash: ' + rhash);
		console.log('ipfs address: http://127.0.0.1/ipfs/' + rhash);

		var g_address = req.body.address;
		
		//设置地址
		//web3.eth.defaultAccount = g_address;
		//

		var account_status = web3.personal.unlockAccount("0x7c8d77649791d9b063d9c9492fd62eeca9aa6577", 'ptt123456');
		if (account_status) {
			console.log('unlock success');	
		}

		var newstr = rhash.split("").reverse().join("");
		var hash = '';

		pool.upload.sendTransaction(req.body.dataid, newstr, {gas:200000}, function(error, result) {
			hash = result;
			res.send(hash);
		});
		var upload = pool.UploadEvent();
		upload.watch(function(error, result) {
			if (!error) {
			//	if (result.transactionHash == hash) {

					console.log("address: " + g_address);
					console.log("dataid: " + result.args.dataid);
					console.log("hashid: " + result.args.hashid);
					console.log("txhash: " + result.transactionHash);
					console.log("txhash address: http://p1.analytab.net:9000/#/transaction/" + result.transactionHash);

					axios.post('http://ums.proton.global/api/vendor/data/record',  {
								address: g_address,
								txhash: result.transactionHash,
								dataid: result.args.dataid,
								hashid: result.args.hashid 
					}).then(function(response){
						console.log('success');
					}).catch(function(err){
						console.log(err);
					});


			//	} else {
			//		console.log(result.transactionHash);	
			//		console.log("hashid: " + result.args.hashid);
			//	} 
			//
			} else {
				console.log(error);
			}
		});

	}).catch((err)=>{
		console.log(err);
	})

});

app.get('/download', function (req, res) {

	pool.downloadContent(function(error, result){
	    if(!error)
	    {
			res.send(result.toString());
		} else {
			console.error(error);
		}
	});

});


app.get('/gethashcount', function (req, res) {

	pool.getHashCount(function(error, result){
	    if(!error)
	    {
			var result = result.toNumber();
			res.send(result.toString());
		} else {
			console.error(error);
		}
	});

});

app.get('/gethash/:summaryid', function (req, res) {
	var dataid = req.params.summaryid;
	pool.getHash(dataid, function(error, result){
	    if(!error)
	    {
			res.send(result.toString());
		} else {
			console.error(error);
		}
	});

});


var server = app.listen(8888, function () {
	var port = server.address().port
	console.log("访问地址为 http://localhost:" + port)
})


