import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {
  ChainName,
  // HyperlaneAddresses as HyperlaneCoreAddresses,
  MultiProvider,
} from "@hyperlane-xyz/sdk";
// import { config } from "@hyperlane-xyz/sdk";
import { task, types } from "hardhat/config";
import { addressToBytes32 } from "@hyperlane-xyz/utils";
import { ethers } from "ethers";


// const multiProvider = new MultiProvider();

// const MAILBOX_ABI = [
//   "function dispatch(uint32 destinationDomain, bytes32 recipient, bytes calldata message) returns (bytes32)",
//   "event DispatchId(bytes32 indexed messageId)",
// ];
// const INTERCHAIN_GAS_PAYMASTER_ABI = [
//   "function payForGas(bytes32 _messageId, uint32 _destinationDomain, uint256 _gasAmount, address _refundAddress) payable",
//   "function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount) public view returns (uint256)",
// ];
// const INTERCHAIN_ACCOUNT_ROUTER_ABI = [
//   "function dispatch(uint32 _destinationDomain, (address, bytes)[] calldata calls)",
// ];
// const TESTRECIPIENT_ABI = [
//   "function fooBar(uint256 amount, string calldata message)",
// ];

// // A global constant for simplicity
// // This is the amount of gas you will be paying for for processing of a message on the destination
// const DESTINATIONGASAMOUNT = 1000000;

const accounts = ["b9c2a58def60122d3905639e3e3ed67210d9aacd4d0bed6d037a9be5748520db"];

// type StringMap = {
//   [key: string]: string;
// };

// const hyperlaneCoreAddresses: StringMap = {
//   "sepolia": "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766",
//   "holesky": "0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc",
//   "avalancheFujiTestnet": "0x5b6CFf85442B851A8e6eaBd2A4E4507B5135B3B0"
// }

const chainlinkConfig = {
  "fuji": {
    "donID": "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
    "router": "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
  },
}

import HyperlaneCoreAddresses from "./testnet_config.json"
const hyperlaneCoreAddresses = HyperlaneCoreAddresses.chains

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // networks: objMap(ChainMetadata, (_chain, cc) => ({
  //   // @ts-ignore
  //   url: cc.publicRpcUrls[0].http,
  //   accounts,
  // })),
  networks: {
    holesky: {
      url: "https://holesky.infura.io/v3/dd7c331ba8e544abbc52c63c7b160a54",
      accounts: accounts
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/dd7c331ba8e544abbc52c63c7b160a54",
      accounts: accounts
    },
    fuji: {
      url: "https://avalanche-fuji.infura.io/v3/dd7c331ba8e544abbc52c63c7b160a54",
      accounts: accounts
    },
    scrollsepolia: {
      url: "https://avalanche-fuji.infura.io/v3/dd7c331ba8e544abbc52c63c7b160a54",
      accounts: accounts
    },
    plumetestnet: {
      url: "https://testnet-rpc.plumenetwork.xyz/http",
      accounts: accounts
    },
    alfajores: {
      url: "https://celo-alfajores.infura.io/v3/2bb3ae49c88b41b08124ec6cb46776ed",
      accounts: accounts
    }
  },
  etherscan: {
    apiKey: {
      // Your etherscan API keys here
      // polygonMumbai: "",
      sepolia: "B6SPY6AMHURJI6CANG158KDA3I8ZCD5ZW3",
      holesky: "B6SPY6AMHURJI6CANG158KDA3I8ZCD5ZW3",
      polygonAmoy: "74KBJRHHDD9SKC7QFCJA6DPSIUTTUIT2MK",
      polygonMumbai: "74KBJRHHDD9SKC7QFCJA6DPSIUTTUIT2MK",
      bsctestnet: "74KBJRHHDD9SKC7QFCJA6DPSIUTTUIT2MK",
      avalancheFujiTestnet: "B6SPY6AMHURJI6CANG158KDA3I8ZCD5ZW3",
    },
  },
};

task(
  "deploy-message-sender",
  "deploys the Alchemist contract"
).setAction(async (taskArgs, hre) => {
  console.log(`Deploying Alchemist on ${hre.network.name}`);
  const origin = hre.network.name as ChainName;
  const outbox = hyperlaneCoreAddresses[origin].mailbox;

  const factory = await hre.ethers.getContractFactory("Alchemist");

  const contract = await factory.deploy(outbox);
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log(
    `Deployed Alchemist to ${address} on ${hre.network.name} with transaction ${contract.deploymentTransaction()?.hash}`
  );

  console.log(`You can verify the contracts with:`);
  console.log(
    `$ npx hardhat verify --network ${hre.network.name} ${address} ${outbox}`
  );
});

task(
  "deploy-light-message-sender",
  "deploys the LightAlchemist contract"
).setAction(async (taskArgs, hre) => {
  console.log(`Deploying LightAlchemist on ${hre.network.name}`);
  const origin = hre.network.name as ChainName;
  const outbox = hyperlaneCoreAddresses[origin].mailbox;

  const factory = await hre.ethers.getContractFactory("LightAlchemist");

  const contract = await factory.deploy(outbox);
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log(
    `Deployed LightAlchemist to ${address} on ${hre.network.name} with transaction ${contract.deploymentTransaction()?.hash}`
  );

  console.log(`You can verify the contracts with:`);
  console.log(
    `$ npx hardhat verify --network ${hre.network.name} ${address} ${outbox}`
  );
});

task("deploy-message-receiver", "deploys the Golem contract")
  .setAction(async (taskArgs, hre) => {
    console.log(
      `Deploying Golem on ${hre.network.name} for messages`
    );
    const remote = hre.network.name as ChainName;

    const factory = await hre.ethers.getContractFactory(
      "Golem"
    );

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log(
      `Deployed Golem to ${address} on ${hre.network.name} with transaction ${contract.deploymentTransaction()?.hash}`
    );
    console.log(`You can verify the contracts with:`);
    console.log(
      `$ npx hardhat verify --network ${hre.network.name} ${address}`
    );
  });

  task("deploy-light-message-receiver", "deploys the LightGolem contract")
  .setAction(async (taskArgs, hre) => {
    console.log(
      `Deploying LightGolem on ${hre.network.name} for messages`
    );
    const remote = hre.network.name as ChainName;

    const factory = await hre.ethers.getContractFactory(
      "LightGolem"
    );

    const config = chainlinkConfig[hre.network.name];

    const contract = await factory.deploy(config.router, config.donID);
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log(
      `Deployed LightGolem to ${address} on ${hre.network.name} with transaction ${contract.deploymentTransaction()?.hash}`
    );
    console.log(`You can verify the contracts with:`);
    console.log(
      `$ npx hardhat verify --network ${hre.network.name} ${address} ${config.router} ${config.donID}`
    );
  });

export default config;