const ethers = require("ethers");

const address = process.env.ADDRESS

const network = process.env.ETHEREUM_NETWORK;
const provider = new ethers.EtherscanProvider(
    network,
    process.env.ETHERSCAN_API_KEY
);

const hello_world = "0x608060405234801561001057600080fd5b504260008190555060b6806100266000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806365008cd614602d575b600080fd5b60336047565b604051603e91906067565b60405180910390f35b60008054905090565b6000819050919050565b6061816050565b82525050565b6000602082019050607a6000830184605a565b9291505056fea26469706673582212203a8a5373caca44fae871a6398d5e2bf317805fc2481e9fdbc5dcca6839fec35664736f6c63430008180033"


const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

// console.log(await provider.getBlockNumber())

const lightAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_outbox",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "destinationDomain",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "recipient",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "message",
          "type": "bytes"
        }
      ],
      "name": "SentMessage",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_destinationDomain",
          "type": "uint32"
        },
        {
          "internalType": "bytes32",
          "name": "_recipient",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "ipfsCode",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "dataHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint64",
          "name": "subscriptionId",
          "type": "uint64"
        },
        {
          "internalType": "uint32",
          "name": "gasLimit",
          "type": "uint32"
        }
      ],
      "name": "sendCommand",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
]

const mailboxAbiconst = [
    {
        inputs: [
          {
            internalType: 'uint32',
            name: 'destinationDomain',
            type: 'uint32',
          },
          {
            internalType: 'bytes32',
            name: 'recipientAddress',
            type: 'bytes32',
          },
          { internalType: 'bytes', name: 'messageBody', type: 'bytes' },
        ],
        name: 'quoteDispatch',
        outputs: [{ internalType: 'uint256', name: 'fee', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
  ]

const alchemist_address = process.env.LIGHT_SENDER;

const alchemist = new ethers.Contract(alchemist_address, abi, signer)

const mailbox_address = "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766";

const mailbox = new ethers.Contract(mailbox_address, abi, signer)

const enc = ethers.AbiCoder.defaultAbiCoder();

const ipfsCode = "bafkreifwpoow7ae3p7ua5l6d7fc7kukipxrfk2ho4ymk72ndkg6cmlkizy";
const hash = ethers.keccak256(hello_world);
const subscrId = 11104;
const gasLimit = 20

// Define the types of the data to encode
const types = ["bytes", "bytes32", "uint64", "unit32"];

// Encode the data
const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
    types,
    [ipfsCode, hash, subscrId, gasLimit]
);

const destID = 43113;
const golemAddr = "0xDD99E0C789e1CFFeef9C2Cd2703f388fb0900Ee2";
const fee = await mailbox.quoteDispatch(destID, golemAddr, encodedData);

const res = await alchemist.sendCommand(destID, golemAddr, ipfsCode, hash, subscrId, gasLimit,
    {
        value: fee
    }
)

console.log(res)
