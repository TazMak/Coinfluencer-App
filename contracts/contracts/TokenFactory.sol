// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InfluencerToken.sol";

contract TokenFactory {
    event TokenCreated(address tokenAddress, string name, string symbol, address creator);
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        InfluencerToken newToken = new InfluencerToken(
            name,
            symbol,
            initialSupply,
            msg.sender
        );
        
        emit TokenCreated(address(newToken), name, symbol, msg.sender);
        return address(newToken);
    }
}
