import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// describe("SaveERC20", function () {
//   async function deploySaveERC20() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const SaveERC20 = await ethers.getContractFactory("SaveERC20");
//     const saveERC20 = await SaveERC20.deploy();

//     return { saveERC20, owner};
//   }
//     it("should deploy contract and display details", async () => {
//       const {saveERC20, owner} = await loadFixture(deploySaveERC20);

//       expect(await saveERC20.deposit(10)).to.emit(owner.address, '10');

describe("SaveERC20 Contract", function () {
  async function deploySaveERC20() {
    const [owner, otherAccount] = await ethers.getSigners();
    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy();

    return { saveERC20, owner};
  }
  
  

    it("should allow depositing tokens", async () => {
      const {saveERC20, owner} = await loadFixture(deploySaveERC20);
      const userAddress = owner; 
      const depositAmount = 10; // 100 tokens

      // Deposit tokens
      await saveERC20.connect(owner).deposit(depositAmount);

      // Check user balance
      const userBalance = await saveERC20.checkUserBalance(userAddress);
      expect(userBalance).to.equal(depositAmount);
    });

    it("should prevent depositing zero value", async () => {
      const {saveERC20, owner} = await loadFixture(deploySaveERC20);
        const userAddress = owner; 

        // Attempt to deposit zero tokens
        await expect(saveERC20.connect(userAddress).deposit(0)).to.be.revertedWith("can't save zero value");
    });

    it("should allow withdrawing tokens", async () => {
      const {saveERC20, owner} = await loadFixture(deploySaveERC20);
        const userAddress = owner;
        const initialDeposit = ethers.parseEther("200"); // Initial deposit
        const withdrawAmount = ethers.parseEther("50"); // Withdraw 50 tokens

        // Deposit initial tokens
        await saveERC20.connect(userAddress).deposit(initialDeposit);

        // Withdraw tokens
        await saveERC20.connect(userAddress).withdraw(withdrawAmount);

        // Check user balance after withdrawal
        const userBalance = await saveERC20.checkUserBalance(userAddress);
        // expect(userBalance).to.equal(initialDeposit.sub(withdrawAmount));
    });

    it("should prevent withdrawing more than available balance", async () => {
      const {saveERC20, owner} = await loadFixture(deploySaveERC20);
        const userAddress = owner;
        const initialDeposit = ethers.parseEther("100"); // Initial deposit
        const withdrawAmount = ethers.parseEther("150"); // Attempt to withdraw more than deposited

        // Deposit initial tokens
        await saveERC20.connect(userAddress).deposit(initialDeposit);

        // Attempt to withdraw more than available balance
        await expect(saveERC20.connect(userAddress).withdraw(withdrawAmount)).to.be.revertedWith("insufficient funds");
    });

    it("should check contract balance", async () => {
      const {saveERC20, owner} = await loadFixture(deploySaveERC20);
        // Get the contract's token balance
        const contractBalance = await saveERC20.checkContractBalance();
    });

});
