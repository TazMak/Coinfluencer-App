const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InfluencerToken", function() {
  let Token, token, TokenFactory, factory, owner, buyer;
  
  beforeEach(async function() {
    [owner, buyer] = await ethers.getSigners();
    
    TokenFactory = await ethers.getContractFactory("TokenFactory");
    factory = await TokenFactory.deploy();
    await factory.deployed();
  });
  
  it("Should create tokens through factory", async function() {
    const tx = await factory.createToken("TestCoin", "TST", ethers.utils.parseEther("1000000"));
    const receipt = await tx.wait();
    
    const event = receipt.events.find(e => e.event === "TokenCreated");
    expect(event).to.not.be.undefined;
    
    const tokenAddress = event.args.tokenAddress;
    Token = await ethers.getContractFactory("InfluencerToken");
    token = await Token.attach(tokenAddress);
    
    expect(await token.name()).to.equal("TestCoin");
    expect(await token.symbol()).to.equal("TST");
    expect(await token.totalSupply()).to.equal(ethers.utils.parseEther("1000000"));
  });
  
  it("Should enforce max wallet ownership", async function() {
    // Create a token first
    const tx = await factory.createToken("TestCoin", "TST", ethers.utils.parseEther("1000000"));
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "TokenCreated");
    const tokenAddress = event.args.tokenAddress;
    
    Token = await ethers.getContractFactory("InfluencerToken");
    token = await Token.attach(tokenAddress);
    
    // Try to transfer more than 10% to buyer
    const maxAmount = ethers.utils.parseEther("100000"); // 10%
    
    // This should succeed
    await token.transfer(buyer.address, maxAmount);
    expect(await token.balanceOf(buyer.address)).to.equal(maxAmount);
    
    // This should fail
    await expect(
      token.transfer(buyer.address, 1)
    ).to.be.revertedWith("Transfer would exceed maximum wallet ownership");
  });
});
