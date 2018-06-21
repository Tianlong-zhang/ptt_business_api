pragma solidity ^0.4.23;

contract Say {
    string private content;
    function set(string _msg) public {
	        content = _msg;
	}
    function say() constant public returns (string) {
	        return content;
	}
}
