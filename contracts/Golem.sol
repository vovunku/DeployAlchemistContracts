// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {FunctionsSource} from "./FunctionSource.sol";

contract Golem {
    mapping(address => address) public contractOwners;

    event ReceivedMessage(uint32 origin, bytes32 sender, bytes message);
    event DeployedContract(address sender, address conractAddress);

    error CreateError(bytes);

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
        }
        if (address(0) == deployedAddress) {
            revert CreateError(parameter);
        }
        // console.log(deployedAddress);
        contractOwners[deployedAddress] = sender;
        emit DeployedContract(sender, deployedAddress);
      }
    }
}

contract LightGolem is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    FunctionsSource internal immutable i_functionsSource;
    bytes32 internal donID;

    mapping(address => address) public contractOwners;
    mapping(bytes32 => bool) public requestsManager;

    event ReceivedRequest(bytes32 origin, address sender, bytes message);
    event DeployedContract(address sender, address conractAddress);

    error CreateError(bytes);
    error InvalidRequestID(bytes32 requestId);

    constructor(address functionsRouterAddress, bytes32 _donID) FunctionsClient(functionsRouterAddress) {
        i_functionsSource = new FunctionsSource();
        donID = _donID;
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable returns (bytes32 requestId) {
      (bytes memory ipfsCode, bytes32 dataHash, uint64 subscriptionId, uint32 gasLimit) = abi.decode(_message, (bytes, bytes32, uint64, uint32));
      FunctionsRequest.Request memory req;
      req.initializeRequestForInlineJavaScript(i_functionsSource.getInstructions());

      string[] memory args = new string[](1);
      args[0] = string(ipfsCode);
      req.setArgs(args);

      requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
      requestsManager[requestId] = true;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
      if (!requestsManager[requestId]) {
        revert InvalidRequestID(requestId);
      }

      (address sender, uint8 opcode, bytes memory parameter, bytes32 salt) = abi.decode(response, (address, uint8, bytes, bytes32));
      emit ReceivedRequest(requestId, sender, response);
      if (opcode == 0) {
        address deployedAddress;
        assembly ("memory-safe") {
            // Allocate memory for the bytecode
            let codeSize := mload(parameter)
            let codePtr := add(parameter, 0x20)

            // Create the new contract using the create2 opcode
            deployedAddress := create2(callvalue(), codePtr, codeSize, salt)
        }
        if (address(0) == deployedAddress) {
            revert CreateError(parameter);
        }
        // console.log(deployedAddress);
        contractOwners[deployedAddress] = sender;
        emit DeployedContract(sender, deployedAddress);
      }
    }
}