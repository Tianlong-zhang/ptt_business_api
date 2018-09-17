pragma solidity ^0.4.23;

contract Permission {
   
      address owner;

      constructor() public {
         owner = msg.sender;
      }

      uint numHashs = 0;

      mapping (uint => string) vendorsMappings;

      event UploadEvent(uint dataid, uint hashid);

      function upload(uint dataid, string hash) public {

         require(owner == msg.sender);
         uint hashid = numHashs++;
         vendorsMappings[hashid] = hash;

         emit UploadEvent(dataid, hashid);
      }

      //权限控制数据条
      function getHash(uint hashid) constant public returns (string) {
         return vendorsMappings[hashid];
      }

}
