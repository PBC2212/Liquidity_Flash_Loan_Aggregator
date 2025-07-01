// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Constants
 * @dev Library containing constants and helper functions
 */
library Constants {
    /*//////////////////////////////////////////////////////////////
                            GENERAL CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @dev Basis points denominator (100% = 10000 bps)
    uint256 internal constant BPS_DENOMINATOR = 10000;

    /// @dev Maximum slippage allowed (10%)
    uint256 internal constant MAX_SLIPPAGE_BPS = 1000;

    /// @dev Minimum collateral ratio (100%)
    uint256 internal constant MIN_COLLATERAL_RATIO_BPS = 10000;

    /// @dev Price staleness threshold (1 hour)
    uint256 internal constant PRICE_STALENESS_THRESHOLD = 3600;

    /// @dev USD decimals for Chainlink feeds
    uint256 internal constant USD_DECIMALS = 8;

    /// @dev Token decimals for calculations
    uint256 internal constant TOKEN_DECIMALS = 18;

    /*//////////////////////////////////////////////////////////////
                          PROTOCOL ADDRESSES
    //////////////////////////////////////////////////////////////*/

    // These would be set per network deployment
    // Mainnet addresses shown as examples

    /// @dev Aave V3 Pool Addresses Provider (Mainnet)
    address internal constant AAVE_POOL_ADDRESSES_PROVIDER = 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e;

    /// @dev Balancer Vault (Mainnet)
    address internal constant BALANCER_VAULT = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;

    /// @dev Uniswap V3 Factory (Mainnet)
    address internal constant UNISWAP_V3_FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;

    /// @dev Uniswap V3 SwapRouter (Mainnet)
    address internal constant UNISWAP_SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    /// @dev Uniswap V3 Quoter (Mainnet)
    address internal constant UNISWAP_QUOTER = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;

    /*//////////////////////////////////////////////////////////////
                            UNISWAP FEES
    //////////////////////////////////////////////////////////////*/

    /// @dev Uniswap V3 fee tiers
    uint24 internal constant FEE_LOW = 500;    // 0.05%
    uint24 internal constant FEE_MEDIUM = 3000; // 0.3%
    uint24 internal constant FEE_HIGH = 10000;  // 1%

    /*//////////////////////////////////////////////////////////////
                           HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Calculate percentage of amount
     * @param amount The base amount
     * @param bps The percentage in basis points
     * @return result The calculated percentage
     */
    function calculatePercentage(uint256 amount, uint256 bps) internal pure returns (uint256 result) {
        result = (amount * bps) / BPS_DENOMINATOR;
    }

    /**
     * @dev Check if a ratio meets minimum requirement
     * @param numerator The numerator value
     * @param denominator The denominator value
     * @param minRatioBps The minimum ratio in basis points
     * @return valid True if ratio meets requirement
     */
    function isValidRatio(
        uint256 numerator,
        uint256 denominator,
        uint256 minRatioBps
    ) internal pure returns (bool valid) {
        if (denominator == 0) return false;
        uint256 ratioBps = (numerator * BPS_DENOMINATOR) / denominator;
        valid = ratioBps >= minRatioBps;
    }

    /**
     * @dev Calculate slippage-adjusted minimum amount
     * @param amount The original amount
     * @param slippageBps The slippage in basis points
     * @return minAmount The minimum amount after slippage
     */
    function calculateMinAmountWithSlippage(
        uint256 amount,
        uint256 slippageBps
    ) internal pure returns (uint256 minAmount) {
        uint256 slippageAmount = calculatePercentage(amount, slippageBps);
        minAmount = amount - slippageAmount;
    }

    /**
     * @dev Normalize price to 18 decimals
     * @param price The price value
     * @param decimals The current decimals
     * @return normalizedPrice The price normalized to 18 decimals
     */
    function normalizePriceTo18Decimals(
        uint256 price,
        uint8 decimals
    ) internal pure returns (uint256 normalizedPrice) {
        if (decimals == 18) {
            normalizedPrice = price;
        } else if (decimals < 18) {
            normalizedPrice = price * (10 ** (18 - decimals));
        } else {
            normalizedPrice = price / (10 ** (decimals - 18));
        }
    }
}