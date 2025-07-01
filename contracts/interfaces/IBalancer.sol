// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IBalancerFlashLoanRecipient
 * @dev Interface for Balancer flash loan recipient
 */
interface IBalancerFlashLoanRecipient {
    /**
     * @dev Called by `FlashLoanProvider` when a flash loan is requested
     * @param tokens Array of tokens being flash-loaned
     * @param amounts Array of amounts for each token being flash-loaned
     * @param feeAmounts Array of fee amounts for each token being flash-loaned
     * @param userData Arbitrary data passed to the flash loan
     */
    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external;
}

/**
 * @title IBalancerVault
 * @dev Interface for Balancer V2 Vault contract
 */
interface IBalancerVault {
    /**
     * @dev Performs a flash loan, sending tokens to `recipient` and executing `receiveFlashLoan` hook
     * @param recipient The address that will receive the tokens and execute the flash loan logic
     * @param tokens Array of tokens to flash loan
     * @param amounts Array of amounts to flash loan for each token
     * @param userData Arbitrary data to pass to the recipient
     */
    function flashLoan(
        IBalancerFlashLoanRecipient recipient,
        IERC20[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData
    ) external;

    /**
     * @dev Returns a Pool's registered tokens, the total balance for each token, and the latest block
     * @param poolId The pool ID
     * @return tokens Array of pool token addresses
     * @return balances Array of token balances in the pool
     * @return lastChangeBlock Block number of the last balance change
     */
    function getPoolTokens(bytes32 poolId)
        external
        view
        returns (
            IERC20[] memory tokens,
            uint256[] memory balances,
            uint256 lastChangeBlock
        );

    struct SwapKind { uint8 GIVEN_IN; uint8 GIVEN_OUT; }

    /**
     * @dev Enum for swap kinds
     */
    enum SwapKindEnum { GIVEN_IN, GIVEN_OUT }

    struct SingleSwap {
        bytes32 poolId;
        SwapKindEnum kind;
        IERC20 assetIn;
        IERC20 assetOut;
        uint256 amount;
        bytes userData;
    }

    struct FundManagement {
        address sender;
        bool fromInternalBalance;
        address payable recipient;
        bool toInternalBalance;
    }

    /**
     * @dev Performs a single swap
     */
    function swap(
        SingleSwap memory singleSwap,
        FundManagement memory funds,
        uint256 limit,
        uint256 deadline
    ) external payable returns (uint256);
}