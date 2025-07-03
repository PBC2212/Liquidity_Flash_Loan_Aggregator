// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPriceOracle {
    function getLatestPrice(address token) external view returns (uint256 price, uint8 decimals);
}

contract PriceOracle is IPriceOracle, Ownable {
    
    mapping(address => uint256) public tokenPrices;
    mapping(address => uint8) public tokenDecimals;
    
    event PriceUpdated(address indexed token, uint256 price, uint8 decimals);
    
    constructor() Ownable(msg.sender) {
        // Initialize with some default prices for common tokens
        // Sepolia WETH
        tokenPrices[0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14] = 2000e8; // $2000
        tokenDecimals[0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14] = 8;
        
        // Sepolia USDC
        tokenPrices[0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8] = 1e8; // $1
        tokenDecimals[0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8] = 8;
        
        // Sepolia LINK
        tokenPrices[0x779877A7B0D9E8603169DdbD7836e478b4624789] = 15e8; // $15
        tokenDecimals[0x779877A7B0D9E8603169DdbD7836e478b4624789] = 8;
    }
    
    function getLatestPrice(address token) external view override returns (uint256 price, uint8 decimals) {
        price = tokenPrices[token];
        decimals = tokenDecimals[token];
        
        // If no price set, return default values
        if (price == 0) {
            price = 1e8; // $1 default
            decimals = 8;
        }
    }
    
    function setTokenPrice(address token, uint256 price, uint8 decimals) external onlyOwner {
        tokenPrices[token] = price;
        tokenDecimals[token] = decimals;
        emit PriceUpdated(token, price, decimals);
    }
    
    function setMultipleTokenPrices(
        address[] calldata tokens,
        uint256[] calldata prices,
        uint8[] calldata decimalsArray
    ) external onlyOwner {
        require(tokens.length == prices.length && prices.length == decimalsArray.length, "Array length mismatch");
        
        for (uint256 i = 0; i < tokens.length; i++) {
            tokenPrices[tokens[i]] = prices[i];
            tokenDecimals[tokens[i]] = decimalsArray[i];
            emit PriceUpdated(tokens[i], prices[i], decimalsArray[i]);
        }
    }
}