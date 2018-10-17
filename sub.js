var Redis = require('redis');
var Web3 = require("web3");
const axios = require("axios")
const ipfsFile = require('./ipfsFile');

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));  
web3.eth.defaultAccount = '0x7c8d77649791d9b063d9c9492fd62eeca9aa6577';

var abi_track=[{"constant":false,"inputs":[{"name":"dataid","type":"uint256"},{"name":"hash","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashid","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHashCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dataid","type":"uint256"},{"indexed":false,"name":"hashid","type":"uint256"}],"name":"UploadEvent","type":"event"}];
var address_track = '0x772e9877ed6477fb6d6ff23a0befe745f8d1d929';

var pool_contract_track = web3.eth.contract(abi_track);
var pool_track = pool_contract_track.at(address_track);

var client = Redis.createClient(6379, '127.0.0.1', {connect_timeout: 30});
var brpop = function() {
    console.log('brpop')
    client.brpop("anchor:test:channel", 5, function(err, response) {
        if(response) {
            let value = JSON.parse(response[1]);
            let buff = Buffer.from(JSON.stringify(value.content));
            ipfsFile.add(buff).then((rhash)=>{
                // console.log('ipfs upload success');
                console.log('ipfs hash: ' + rhash);
                // console.log('ipfs address: http://ipfs.analytab.net/ipfs/' + rhash);
                // console.log('ipfs address: http://localhost/ipfs/' + rhash);
                
                var account_status = web3.personal.unlockAccount("0x7c8d77649791d9b063d9c9492fd62eeca9aa6577", 'ptt123456');
                if (account_status) {
                    // console.log('unlock success');
                }

                var hash = '';
                pool_track.upload.sendTransaction(value.data_id, rhash, {gas:200000}, function(error, result) {
                    hash = result;
                    res.send(hash.toString());
                });
                
                var upload = pool_track.UploadEvent();
                upload.watch(function(error, result) {
                    if (!error) {
                        // console.log("dataid: " + result.args.dataid);
                        console.log("txhash: " + result.transactionHash);
                        axios.post('http://ums.proton.global/api/v1/track_node_call',  {
                            txhash: result.transactionHash,
                            dataid: result.args.dataid,
                        }).then(function(response){
                            // console.log(response);
                        }).catch(function(err){
                            console.log(err);
                        });
                    } else {
                        console.log(error);
                    }
                });
                brpop();
            }).catch((err)=>{
                console.log(err);
                brpop();
            })
        } else {
            brpop();
        }
    });
};

brpop();