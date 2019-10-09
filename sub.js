var Redis = require('redis');
var Web3 = require("web3");
const axios = require("axios")
const ipfsFile = require('./ipfsFile');
const crypto = require('crypto');
var config = new(require('./config.js'))();

// 秘钥
var key = 'Password!';
// 加密函数
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
// 解密函数
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

web3 = new Web3(config.provider);  
web3.eth.defaultAccount = config.defaultAccount;

var abi_track=[{"constant":false,"inputs":[{"name":"dataid","type":"uint256"},{"name":"hash","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashid","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHashCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dataid","type":"uint256"},{"indexed":false,"name":"hashid","type":"uint256"}],"name":"UploadEvent","type":"event"}];
var address_track = config.poolAddressTrack;

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
                // console.log('ipfs address: http://ipfs.analytab.net/ipfs/' + rhash);
                // console.log('ipfs address: http://localhost/ipfs/' + rhash);

                console.log('ipfs hash: ' + rhash);
                // 加密ipfs hash
                var rhash = aesEncrypt(rhash, key);
                console.log('encrypt ipfs hash: ' + rhash);
                
                var account_status = web3.personal.unlockAccount(config.defaultAccount, config.defaultAccountPassword);
                if (account_status) {
                    // console.log('unlock success');
                }

                var hash = '';
                pool_track.upload.sendTransaction(value.data_id, rhash, {gas:200000}, function(error, result) {
                    hash = result;
                    console.log(hash.toString());
                    // res.send(hash.toString());
                });
                
                var upload = pool_track.UploadEvent();
                upload.watch(function(error, result) {
                    if (!error) {
                        // console.log("dataid: " + result.args.dataid);
                        // console.log("txhash: " + result.transactionHash);
                        axios.post(config.callbackHost + '/api/v1/track_node_call',  {
                            txhash: result.transactionHash,
                            dataid: result.args.dataid,
                        }).then(function(response){
                            // console.log(response);
                            upload.stopWatching();
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