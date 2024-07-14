# DeployAlchemistContracts

Here we have the contract codes that uses hyperlane and chainlink to make a middleware for creating and controlling smart contracts on the several chains.

There are already some Senders(Alchemistes) and Receivers(Golems) created on the various blockchains(such as Sepolia ETH, Avax Fuji, Celo Alfajores etc) and you can find their addresses in the out dir.

However you can simply deploy Alchemistes and Receivers yourselves just by following those instructions:

Clone this repo, then

```shell
npm install
npx hardhat test
npx hardhat compile
```

We have several commands to deploy:

- Alchemist

```shell
npx hardhat deploy-message-sender --network <your-network>
```

It basically deploys an Alchemist, controller smart contract on a specific chain.

- Golem

```shell
npx hardhat deploy-message-receiver --network <your-network>
```

Deploys a Golem, "factory" and deployer smart contract on a specific chain that will run code that we send to it.

- LightAlchemist

```shell
npx hardhat deploy-light-message-sender --network <your-network>
```

Its a somehow more complicated version of an Alchemist, where's we don't pass message to a Golem directly, but via ipfs and ipfs-identificator, which allows to significantlly decrease fees on the data transferring.

- LightReceiver

```shell
npx hardhat deploy-light-message-receiver --network <your-network>
```

Its a somehow more complicated version of an Golem, where's he doesn't receive instructions from an Alchemist directly, but only ipfs-identificator, which he will use after to access ipfs to retreave complete data.

## Related projects

DeployAlchemist Terraform module: https://github.com/ipsavitsky/DeployAlchemist


DeployAlchemist utilisation example : https://github.com/ipsavitsky/DeployAlchemist_example

