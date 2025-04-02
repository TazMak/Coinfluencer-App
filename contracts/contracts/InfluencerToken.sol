// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InfluencerToken is ERC20, Ownable {
    uint256 public constant MAX_OWNERSHIP_PERCENTAGE = 10;
    uint256 public immutable maxTokensPerWallet;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address creator
    ) ERC20(name, symbol) Ownable() {
        _mint(creator, initialSupply);
        maxTokensPerWallet = (initialSupply * MAX_OWNERSHIP_PERCENTAGE) / 100;
        transferOwnership(creator);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (to != address(0)) { // Not burning tokens
            require(
                balanceOf(to) + amount <= maxTokensPerWallet,
                "Transfer would exceed maximum wallet ownership"
            );
        }
        super._beforeTokenTransfer(from, to, amount);
    }
}
