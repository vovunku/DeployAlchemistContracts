import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";
  import data from "./data.json"
  
  describe("Golem", function () {
  
    describe("Deployment", function () {
      it("Deploy test", async function () {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();
    
        const Golem = await hre.ethers.getContractFactory("Golem");
        const golem = await Golem.deploy();
    
        // Define the types of the data to encode
        const types = ["address", "uint8", "bytes", "bytes32"];

        // Encode the data
        const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
            types,
            [data.sender, data.opcode, data.hello_world, data.salt]
        );

        const res = await golem.handle(0, data.salt, encodedData);

        return { golem, owner, otherAccount };
  
      });
    });

    describe("Deployment", function () {
        it("Deploy test", async function () {
          // Contracts are deployed using the first signer/account by default
          const [owner, otherAccount] = await hre.ethers.getSigners();
          const abi = ethers.AbiCoder.defaultAbiCoder();
      
          const Golem = await hre.ethers.getContractFactory("Golem");
          const golem = await Golem.deploy();
      
          // Define the types of the data to encode
          const types = ["address", "uint8", "bytes", "bytes32"];
  
          const completeBytecode = abi.encode(["bytes", "uint"], [data.bytecode, 100000000000000])

          // Encode the data
          const encodedData = abi.encode(
              types,
              [data.sender, data.opcode, completeBytecode, data.salt]
          );
  
          const res = await golem.handle(0, data.salt, encodedData);
  
          return { golem, owner, otherAccount };
    
        });
      });
  
    //   it("Should set the right owner", async function () {
    //     const { lock, owner } = await loadFixture(deployOneYearLockFixture);
  
    //     expect(await lock.owner()).to.equal(owner.address);
    //   });
  
    //   it("Should receive and store the funds to lock", async function () {
    //     const { lock, lockedAmount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
  
    //     expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
    //       lockedAmount
    //     );
    //   });
  
    //   it("Should fail if the unlockTime is not in the future", async function () {
    //     // We don't use the fixture here because we want a different deployment
    //     const latestTime = await time.latest();
    //     const Lock = await hre.ethers.getContractFactory("Lock");
    //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //       "Unlock time should be in the future"
    //     );
    //   });
    // });
  
    // describe("Withdrawals", function () {
    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       const { lock } = await loadFixture(deployOneYearLockFixture);
  
    //       await expect(lock.withdraw()).to.be.revertedWith(
    //         "You can't withdraw yet"
    //       );
    //     });
  
    //     it("Should revert with the right error if called from another account", async function () {
    //       const { lock, unlockTime, otherAccount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(unlockTime);
  
    //       // We use lock.connect() to send a transaction from another account
    //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //         "You aren't the owner"
    //       );
    //     });
  
    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       const { lock, unlockTime } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw()).not.to.be.reverted;
    //     });
    //   });
  
    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       const { lock, unlockTime, lockedAmount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw())
    //         .to.emit(lock, "Withdrawal")
    //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    //   });
  
    //   describe("Transfers", function () {
    //     it("Should transfer the funds to the owner", async function () {
    //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //         deployOneYearLockFixture
    //       );
  
    //       await time.increaseTo(unlockTime);
  
    //       await expect(lock.withdraw()).to.changeEtherBalances(
    //         [owner, lock],
    //         [lockedAmount, -lockedAmount]
    //       );
    //     });
    //   });
    // });
  });