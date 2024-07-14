// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract Alchemist {
    IMailbox outbox;
    event SentMessage(uint32 destinationDomain, bytes32 recipient, bytes message);

    constructor(address _outbox) {
        outbox = IMailbox(_outbox);
    }

    function sendCommand(
        uint32 _destinationDomain,
        bytes32 _recipient,
        uint8 opcode, 
        bytes calldata parameter, 
        bytes32 salt
    ) external payable {
        bytes memory _message = abi.encode(msg.sender, opcode, parameter, salt);
        uint256 fee = outbox.quoteDispatch(_destinationDomain, _recipient, _message);
        outbox.dispatch{value: fee}(_destinationDomain, _recipient, _message);
        emit SentMessage(_destinationDomain, _recipient, _message);
    }

    receive() external payable {}
}

contract LightAlchemist {
    IMailbox outbox;
    event SentMessage(uint32 destinationDomain, bytes32 recipient, bytes message);

    constructor(address _outbox) {
        outbox = IMailbox(_outbox);
    }

    function sendCommand(
        uint32 _destinationDomain,
        bytes32 _recipient,
        bytes calldata ipfsCode, 
        bytes32 dataHash, 
        uint64 subscriptionId, 
        uint32 gasLimit
    ) external payable {
        bytes memory _message = abi.encode(ipfsCode, dataHash, subscriptionId, gasLimit);
        uint256 fee = outbox.quoteDispatch(_destinationDomain, _recipient, _message);
        outbox.dispatch{value: fee}(_destinationDomain, _recipient, _message);
        emit SentMessage(_destinationDomain, _recipient, _message);
    }

    receive() external payable {}
}

