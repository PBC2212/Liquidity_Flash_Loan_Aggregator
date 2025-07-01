// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IChainlink.sol";
import "./libraries/Constants.sol";

/**
 * @title PriceOracle
 * @dev Basic price oracle for getting USD prices of tokens using Chainlink feeds
 * @author Your Team
 */
contract PriceOracle is Ownable, IPriceOracle {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @dev Mapping from token address to Chainlink price feed address
    mapping(address => address) public priceFeeds;

    /// @dev Mapping from token address to token decimals
    mapping(address => uint8) public tokenDecimals;

    /// @dev Maximum allowed price staleness (1 hour)
    uint256 public constant MAX_PRICE_STALENESS = 3600;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event PriceFeedAdded(address indexed token, address indexed priceFeed, uint8 decimals);
    event PriceFeedRemoved(address indexed token);

    /*//////////////////////////////////////////////////////////////
                            CUSTOM ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidToken();
    error InvalidPriceFeed();
    error PriceFeedNotFound();
    error StalePrice();
    error InvalidPrice();

    /*//////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Initialize the price oracle
     * @param _owner Address that will own the contract
     */
    constructor(address _owner) {
        if (_owner == address(0)) revert InvalidToken();
        _transferOwnership(_owner);
    }

    /*//////////////////////////////////////////////////////////////
                         PRICE FEED MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Add a price feed for a token
     * @param token The token address
     * @param priceFeed The Chainlink price feed address
     * @param decimals The number of decimals for the token
     */
    function addPriceFeed(
        address token,
        address priceFeed,
        uint8 decimals
    ) external onlyOwner {
        if (token == address(0)) revert InvalidToken();
        if (priceFeed == address(0)) revert InvalidPriceFeed();
        
        priceFeeds[token] = priceFeed;
        tokenDecimals[token] = decimals;
        
        emit PriceFeedAdded(token, priceFeed, decimals);
    }

    /**
     * @dev Remove a price feed for a token
     * @param token The token address
     */
    function removePriceFeed(address token) external onlyOwner {
        if (priceFeeds[token] == address(0)) revert PriceFeedNotFound();
        
        delete priceFeeds[token];
        delete tokenDecimals[token];
        
        emit PriceFeedRemoved(token);
    }

    /*//////////////////////////////////////////////////////////////
                           PRICE QUERIES
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Get the USD price of a token (implements IPriceOracle)
     * @param token The token address
     * @return price The price in USD (18 decimals)
     */
    function getTokenPriceUSD(address token) external view override returns (uint256 price) {
        address priceFeed = priceFeeds[token];
        if (priceFeed == address(0)) revert PriceFeedNotFound();

        try AggregatorV3Interface(priceFeed).latestRoundData() returns (
            uint80,
            int256 answer,
            uint256,
            uint256 updatedAt,
            uint80