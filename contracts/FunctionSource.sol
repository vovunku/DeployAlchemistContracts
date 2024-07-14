// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FunctionsSource {
    string public getInstructions = "const { ethers } = await import('npm:ethers@6.10.0');"
        "const abiCoder = ethers.AbiCoder.defaultAbiCoder();" "const dataFingerprint = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "    url: `https://gateway.lighthouse.storage/ipfs/${dataFingerprint}`,"
        "    method: 'GET',"
        "    responseType: 'text'"
        "});"
        "const data = apiResponse.data.replaceAll('\n', '');"
        "return ethers.getBytes(data);";
}