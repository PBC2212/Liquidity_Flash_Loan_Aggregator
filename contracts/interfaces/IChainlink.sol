// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title AggregatorV3Interface
 * @dev Interface for Chainlink price feeds
 */
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);

    /**
     * @dev getRoundData and latestRoundData should both raise "No data present"
     * if they do not have data to report, instead of returning unset values
     * which could be misinterpreted as actual reported values.
     */
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title IPriceOracle
 * @dev Generic interface for price oracle contracts
 */
interface IPriceOracle {
    /**
     * @dev Returns the latest price and decimals for a token
     * @param token The address of the token
     * @return price The price of the token
     * @return decimals The number of decimals for the price
     */
    function getLatestPrice(address token) external view returns (uint256 price, uint8 decimals);

    /**
     * @dev Returns the USD price of a token (18 decimals)
     * @param token The address of the token
     * @return price The price in USD
     */
    function getTokenPriceUSD(address token) external view returns (uint256 price);
}

/**
 * @title IChainlinkAggregator
 * @dev Extended interface for Chainlink aggregators with additional functionality
 */
interface IChainlinkAggregator is AggregatorV3Interface {
    function minAnswer() external view returns (int192);
    function maxAnswer() external view returns (int192);
    function aggregator() external view returns (address);
    function phaseId() external view returns (uint16);
    function phaseAggregators(uint16 phaseId) external view returns (address);
}

/**
 * @title IPriceFeedRegistry
 * @dev Interface for Chainlink Price Feed Registry
 */
interface IPriceFeedRegistry {
    /**
     * @dev Returns the price feed address for the given base and quote
     * @param base Base asset address
     * @param quote Quote asset address (usually USD)
     * @return aggregator The price feed address
     */
    function getFeed(address base, address quote) external view returns (address aggregator);

    /**
     * @dev Returns whether a price feed exists for the given base and quote
     * @param base Base asset address
     * @param quote Quote asset address
     * @return True if feed exists, false otherwise
     */
    function isFeedEnabled(address base, address quote) external view returns (bool);

    /**
     * @dev Returns the latest price for the given base and quote
     * @param base Base asset address
     * @param quote Quote asset address
     * @return price The latest price
     */
    function latestAnswer(address base, address quote) external view returns (int256 price);

    /**
     * @dev Returns the number of decimals for the given base and quote pair
     * @param base Base asset address
     * @param quote Quote asset address
     * @return decimals Number of decimals
     */
    function decimals(address base, address quote) external view returns (uint8);
}