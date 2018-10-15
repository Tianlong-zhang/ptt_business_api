pragma solidity ^0.4.23;

contract Pool {
    
   	mapping (uint => string) vendorsMappings;

   	event UploadEvent(uint dataid, uint hashid);

   	uint numHashs = 0;

      address owner;

      constructor() public {
         owner = msg.sender;
      } 

   	function upload(uint dataid, string hash) public {

         require(owner == msg.sender);
   		uint hashid = numHashs++;
   		vendorsMappings[hashid] = hash;

   		emit UploadEvent(dataid, hashid);
   	}
    
   	function getHash(uint hashid) constant public returns (string) {
   		return vendorsMappings[hashid];
   	}

   	function getHashCount() constant public returns (uint) {
   		return numHashs;	
   	}
}


