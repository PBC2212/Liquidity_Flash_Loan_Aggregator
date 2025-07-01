// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IUniswapV3Pool
 * @dev Interface for Uniswap V3 Pool for flash loans
 */
interface IUniswapV3Pool {
    /**
     * @dev Initiate a flash loan
     * @param recipient The address which will receive the token0 and token1 quantities
     * @param amount0 The amount of token0 to send
     * @param amount1 The amount of token1 to send
     * @param data Any data to be passed through to the callback
     */
    function flash(
        address recipient,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;

    /**
     * @dev The first of the two tokens of the pool, sorted by address
     * @return The token contract address
     */
    function token0() external view returns (address);

    /**
     * @dev The second of the two tokens of the pool, sorted by address
     * @return The token contract address
     */
    function token1() external view returns (address);

    /**
     * @dev The pool's fee in hundredths of a bip, i.e. 1e-6
     * @return The fee
     */
    function fee() external view returns (uint24);
}

/**
 * @title IUniswapV3FlashCallback
 * @dev Interface for Uniswap V3 flash loan callback
 */
interface IUniswapV3FlashCallback {
    /**
     * @dev Called on `msg.sender` after transferring to the recipient from IUniswapV3Pool#flash
     * @param fee0 The fee amount in token0 due to the pool by the end of the flash
     * @param fee1 The fee amount in token1 due to the pool by the end of the flash
     * @param data Any data passed through by the caller via the IUniswapV3PoolActions#flash call
     */
    function uniswapV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external;
}

/**
 * @title IUniswapV3Factory
 * @dev Interface for Uniswap V3 Factory
 */
interface IUniswapV3Factory {
    /**
     * @dev Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist
     * @param tokenA The contract address of either token0 or token1
     * @param tokenB The contract address of the other token
     * @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip
     * @return pool The pool address
     */
    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}

/**
 * @title ISwapRouter
 * @dev Interface for Uniswap V3 SwapRouter
 */
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    /**
     * @dev Swaps `amountIn` of one token for as much as possible of another token
     * @param params The parameters necessary for the swap, encoded as `ExactInputSingleParams` in calldata
     * @return amountOut The amount of the received token
     */
    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    /**
     * @dev Swaps `amountIn` of one token for as much as possible of another along the specified path
     * @param params The parameters necessary for the multi-hop swap, encoded as `ExactInputParams` in calldata
     * @return amountOut The amount of the received token
     */
    function exactInput(ExactInputParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

/**
 * @title IQuoter
 * @dev Interface for Uniswap V3 Quoter for price estimation
 */
interface IQuoter {
    /**
     * @dev Returns the amount out received for a given exact input swap without executing the swap
     * @param tokenIn The address of the input token
     * @param tokenOut The address of the output token
     * @param fee The fee of the token pool to consider for the pair
     * @param amountIn The amount of the input token
     * @param sqrtPriceLimitX96 The price limit of the pool that cannot be exceeded by the swap
     * @return amountOut The amount of the output token
     */
    function quoteExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);
}