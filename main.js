const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const ipfsFile = require("./ipfsFile");
const axiosFunc = require("./axiosFunction")
const User = require('./database/UserModel')

const web3 = new Web3(new Web3.providers.HttpProvider("http://47.96.117.14:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

var abi = [
	{
		"constant": false,
		"inputs": [{"name":"_msg","type":"string"}],
		"name": "set","outputs":[],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "say",
		"outputs": [{"name":"","type":"string"}],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var address = '0xaaa71c94e9daacabb740cb4730fbd6706072e2bd';
var contract = new web3.eth.Contract(abi,address);

var app = express();
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  	extended: true
}));
 
app.get('/', function (req, res) {
	User.findAddress(req.query.address).then(function(user) {
		console.log('****************************');
		if (user) {
			console.log('user id : ', user.id);
			console.log('user address : ', user.address);
		} else {
			console.log("didn't find");
		}
	})
	
	// axiosFunc.get('http://ums.analytab.net/api/business/match_items/', {name: "kana"})
	// axiosFunc.post('http://ums.analytab.net/api/business/users/login', {name: "kana"})
	contract.methods.say().call().then(function(result){
		let data = {
			status: "success",
			data: result,
		}
		// res.send(req.query.name)
		res.send(JSON.stringify(data))
	});
})

//POST 请求
app.post('/api/v1/users_upload', function (req, res) {
    if (req.body.data) {
		//能正确解析 json 格式的post参数
		//操作内容
		let buff = Buffer.from(JSON.stringify(req.body.data));
		ipfsFile.add(buff).then((hash)=>{
			res.send({"status": "success", "name": req.body.data.name, "gender": req.body.data.gender, "hash": hash});
		}).catch((err)=>{
			//上传失败
			console.log(err);
			res.send({"status":"upload error"});
		})
    } else {
        //不能正确解析json 格式的post参数
		res.send({"status":"error"});
    }
});

var server = app.listen(8888, function () {
	var port = server.address().port
	console.log("访问地址为 http://localhost:" + port)
})

//操作文件
// let addPath = "./test.txt";
// let getPath = "./storage/get/onepiece.jpg";
// let buff = fs.readFileSync(addPath);
// ipfsFile.add(buff).then((hash)=>{
//     console.log(hash);
//     console.log("http://localhost:8080/ipfs/"+hash);
//     return ipfsFile.get(hash);
// }).then((buff)=>{
//     fs.writeFileSync(getPath,buff);
//     console.log("file:"+getPath);
// }).catch((err)=>{
//     console.log(err);
// })