// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract Golem {
    mapping(address => address) public contractOwners;

    event ReceivedMessage(uint32 origin, bytes32 sender, bytes message);
    event DeployedContract(address sender, address conractAddress);

    constructor() {
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable {
      (address sender, uint8 opcode, bytes memory parameter, bytes32 salt) = abi.decode(_message, (address, uint8, bytes, bytes32));
      emit ReceivedMessage(_origin, _sender, _message);
      if (opcode == 0) {
        address deployedAddress;
        assembly ("memory-safe") {
            // Allocate memory for the bytecode
            let codeSize := mload(parameter)
            let codePtr := add(parameter, 0x20)

            // Create the new contract using the create2 opcode
            deployedAddress := create2(callvalue(), codePtr, codeSize, salt)
            if iszero(deployedAddress) {
                revert(0, 0)
            }
        }
        // console.log(deployedAddress);
        contractOwners[deployedAddress] = sender;
        emit DeployedContract(sender, deployedAddress);
      }
    }
}