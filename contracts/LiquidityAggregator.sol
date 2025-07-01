// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Price oracle interface
interface IPriceOracle {
    function getLatestPrice(address token) external view returns (uint256 price, uint8 decimals);
}

contract LiquidityAggregator is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum FlashLoanProvider { AAVE, BALANCER, UNISWAP }

    address public daoAddress;
    IPriceOracle public priceOracle;
    uint256 public minimumCollateralRatio = 10500; // 105%
    uint256 public slippageTolerance = 300; // 3%

    mapping(address => bool) public allowedERC20Collateral;
    mapping(address => bool) public allowedERC721Collateral;

    // Collateral tracking (for demonstration, not production-grade accounting)
    mapping(address => mapping(address => uint256)) public userERC20Collateral;

    // EVENTS
    event FlashLoanExecuted(
        address indexed user,
        FlashLoanProvider provider,
        address indexed loanAsset,
        uint256 loanAmount,
        address[] collateralTokens,
        uint256[] collateralAmounts
    );
    event CollateralAdded(address indexed token, bool isERC721);
    event CollateralRemoved(address indexed token, bool isERC721);
    event DAOAddressUpdated(address indexed oldDAO, address indexed newDAO);
    event MinimumCollateralRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event SlippageToleranceUpdated(uint256 oldTolerance, uint256 newTolerance);
    event PriceOracleUpdated(address indexed oldOracle, address indexed newOracle);
    event CollateralPulled(address indexed user, address indexed token, uint256 amountOrId, bool isERC721);
    event CollateralSwapped(address indexed user, address[] collateralTokens, uint256[] collateralAmounts, address outputAsset, uint256 outputAmount);
    event LoanRepaid(address indexed user, address loanAsset, uint256 repayAmount, FlashLoanProvider provider);

    // ERRORS
    error InvalidProvider();
    error InvalidCollateral();
    error InsufficientCollateralValue();
    error SwapFailed();
    error RepaymentFailed();
    error UnauthorizedCallback();
    error InvalidPrice();
    error SlippageExceeded();
    error DAOOnly();
    error InvalidAddress();
    error InvalidRatio();
    error LengthMismatch();
    error NotAllowedCollateral();

    // MODIFIERS
    modifier onlyDAO() {
        if (msg.sender != daoAddress) revert DAOOnly();
        _;
    }

    // Replace with actual provider addresses in production
    modifier onlyTrustedProvider() {
        if (
            msg.sender != address(0xAAVE_PROVIDER) &&
            msg.sender != address(0xBALANCER_PROVIDER) &&
            msg.sender != address(0xUNISWAP_PROVIDER)
        ) revert UnauthorizedCallback();
        _;
    }

    constructor(address _daoAddress, address _priceOracle) {
        if (_daoAddress == address(0)) revert InvalidAddress();
        if (_priceOracle == address(0)) revert InvalidAddress();
        daoAddress = _daoAddress;
        priceOracle = IPriceOracle(_priceOracle);
        _transferOwnership(_daoAddress);
    }

    // MAIN FLASH LOAN FUNCTION
    function initiateFlashLoan(
        FlashLoanProvider provider,
        address loanAsset,
        uint256 loanAmount,
        address[] calldata collateralTokens,
        uint256[] calldata collateralAmounts
    ) external nonReentrant {
        if (collateralTokens.length != collateralAmounts.length) revert LengthMismatch();
        if (loanAsset == address(0) || loanAmount == 0) revert InvalidCollateral();

        // Validate and pull collateral
        _pullCollateral(collateralTokens, collateralAmounts, msg.sender);

        // Verify collateral value
        if (!_verifyCollateralValue(collateralTokens, collateralAmounts, loanAsset, loanAmount, 0))
            revert InsufficientCollateralValue();

        // Encode flash loan params
        bytes memory params = abi.encode(
            msg.sender, // user
            collateralTokens,
            collateralAmounts
        );

        // Initiate flash loan (pseudo code, replace with actual provider call)
        if (provider == FlashLoanProvider.AAVE) {
            // IAaveLendingPool(aaveAddress).flashLoan(address(this), loanAsset, loanAmount, params);
            revert("Aave flash loan not wired up. Replace with actual call.");
        } else if (provider == FlashLoanProvider.BALANCER) {
            // IBalancerVault(balancerAddress).flashLoan(address(this), loanAsset, loanAmount, params);
            revert("Balancer flash loan not wired up. Replace with actual call.");
        } else if (provider == FlashLoanProvider.UNISWAP) {
            // IUniswapV3Pool(uniswapAddress).flash(address(this), loanAsset, loanAmount, params);
            revert("Uniswap flash loan not wired up. Replace with actual call.");
        } else {
            revert InvalidProvider();
        }

        emit FlashLoanExecuted(msg.sender, provider, loanAsset, loanAmount, collateralTokens, collateralAmounts);
    }

    // FLASH LOAN CALLBACKS

    // Aave flash loan callback
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external onlyTrustedProvider nonReentrant returns (bool) {
        // Decode params
        (address user, address[] memory collateralTokens, uint256[] memory collateralAmounts) = abi.decode(params, (address, address[], uint256[]));

        // Swap collateral for loan asset
        uint256 outputAmount = _swapCollateral(collateralTokens, collateralAmounts, assets[0], amounts[0] + premiums[0], user);

        // Repay flash loan
        _repayLoan(assets[0], amounts[0] + premiums[0], FlashLoanProvider.AAVE);

        emit LoanRepaid(user, assets[0], amounts[0] + premiums[0], FlashLoanProvider.AAVE);

        return true;
    }

    // Balancer flash loan callback
    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external onlyTrustedProvider nonReentrant {
        (address user, address[] memory collateralTokens, uint256[] memory collateralAmounts) = abi.decode(userData, (address, address[], uint256[]));

        uint256 outputAmount = _swapCollateral(collateralTokens, collateralAmounts, address(tokens[0]), amounts[0] + feeAmounts[0], user);

        _repayLoan(address(tokens[0]), amounts[0] + feeAmounts[0], FlashLoanProvider.BALANCER);

        emit LoanRepaid(user, address(tokens[0]), amounts[0] + feeAmounts[0], FlashLoanProvider.BALANCER);
    }

    // Uniswap V3 flash loan callback
    function uniswapV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external onlyTrustedProvider nonReentrant {
        (address user, address[] memory collateralTokens, uint256[] memory collateralAmounts, address loanAsset, uint256 loanAmount) =
            abi.decode(data, (address, address[], uint256[], address, uint256));

        uint256 outputAmount = _swapCollateral(collateralTokens, collateralAmounts, loanAsset, loanAmount + fee0 + fee1, user);

        _repayLoan(loanAsset, loanAmount + fee0 + fee1, FlashLoanProvider.UNISWAP);

        emit LoanRepaid(user, loanAsset, loanAmount + fee0 + fee1, FlashLoanProvider.UNISWAP);
    }

    // COLLATERAL MANAGEMENT

    function _pullCollateral(
        address[] calldata collateralTokens,
        uint256[] calldata collateralAmounts,
        address user
    ) internal {
        for (uint256 i = 0; i < collateralTokens.length; i++) {
            address token = collateralTokens[i];
            uint256 amountOrId = collateralAmounts[i];

            if (allowedERC20Collateral[token]) {
                IERC20(token).safeTransferFrom(user, address(this), amountOrId);
                userERC20Collateral[user][token] += amountOrId;
                emit CollateralPulled(user, token, amountOrId, false);
            } else if (allowedERC721Collateral[token]) {
                IERC721(token).transferFrom(user, address(this), amountOrId);
                emit CollateralPulled(user, token, amountOrId, true);
            } else {
                revert NotAllowedCollateral();
            }
        }
    }

    function _verifyCollateralValue(
        address[] calldata collateralTokens,
        uint256[] calldata collateralAmounts,
        address loanAsset,
        uint256 loanAmount,
        uint256 premium
    ) internal view returns (bool) {
        uint256 totalValue = 0;
        (uint256 loanAssetPrice, uint8 loanAssetDecimals) = getChainlinkPrice(loanAsset);

        for (uint256 i = 0; i < collateralTokens.length; i++) {
            address token = collateralTokens[i];
            uint256 amountOrId = collateralAmounts[i];
            (uint256 price, uint8 decimals) = getChainlinkPrice(token);
            if (price == 0) revert InvalidPrice();

            // Normalize to 18 decimals for calculation
            uint256 value;
            if (allowedERC20Collateral[token]) {
                value = (price * amountOrId) / (10 ** decimals);
            } else if (allowedERC721Collateral[token]) {
                value = price; // Assume price is per NFT
            }
            totalValue += value;
        }

        uint256 requiredValue = ((loanAmount + premium) * minimumCollateralRatio * loanAssetPrice) / (10000 * (10 ** loanAssetDecimals));
        return totalValue >= requiredValue;
    }

    // SWAP COLLATERAL FOR LOAN ASSET (stub: replace with DEX integration)
    function _swapCollateral(
        address[] memory collateralTokens,
        uint256[] memory collateralAmounts,
        address targetAsset,
        uint256 minAmountOut,
        address user
    ) internal returns (uint256 outputAmount) {
        // For demonstration, assume collateral is same as targetAsset and just transfer
        // In production, integrate with Uniswap, 1inch, or other DEX aggregator here
        // and perform slippage check

        for (uint256 i = 0; i < collateralTokens.length; i++) {
            if (collateralTokens[i] == targetAsset) {
                uint256 amount = collateralAmounts[i];
                IERC20(targetAsset).safeTransfer(msg.sender, amount);
                outputAmount += amount;
            }
        }

        if (outputAmount < minAmountOut) revert SlippageExceeded();

        emit CollateralSwapped(user, collateralTokens, collateralAmounts, targetAsset, outputAmount);
    }

    // REPAY FLASH LOAN (stub: just approve for provider, actual logic depends on provider)
    function _repayLoan(
        address loanAsset,
        uint256 repayAmount,
        FlashLoanProvider provider
    ) internal {
        IERC20(loanAsset).safeApprove(msg.sender, repayAmount); // Approve provider to pull funds
    }

    // CHAINLINK PRICE FETCHER
    function getChainlinkPrice(address token) public view returns (uint256 price, uint8 decimals) {
        (price, decimals) = priceOracle.getLatestPrice(token);
    }

    // GOVERNANCE FUNCTIONS
    function addAllowedCollateral(address token, bool isERC721) external onlyDAO {
        if (token == address(0)) revert InvalidAddress();
        if (isERC721) {
            allowedERC721Collateral[token] = true;
        } else {
            allowedERC20Collateral[token] = true;
        }
        emit CollateralAdded(token, isERC721);
    }

    function removeAllowedCollateral(address token, bool isERC721) external onlyDAO {
        if (isERC721) {
            allowedERC721Collateral[token] = false;
        } else {
            allowedERC20Collateral[token] = false;
        }
        emit CollateralRemoved(token, isERC721);
    }

    function setSlippageTolerance(uint256 bps) external onlyDAO {
        if (bps > 1000) revert InvalidRatio(); // Max 10%
        uint256 oldTolerance = slippageTolerance;
        slippageTolerance = bps;
        emit SlippageToleranceUpdated(oldTolerance, bps);
    }

    function setMinimumCollateralRatio(uint256 bps) external onlyDAO {
        if (bps < 10000) revert InvalidRatio(); // Must be >= 100%
        uint256 oldRatio = minimumCollateralRatio;
        minimumCollateralRatio = bps;
        emit MinimumCollateralRatioUpdated(oldRatio, bps);
    }

    function setDAOAddress(address newDAO) external onlyDAO {
        if (newDAO == address(0)) revert InvalidAddress();
        address oldDAO = daoAddress;
        daoAddress = newDAO;
        _transferOwnership(newDAO);
        emit DAOAddressUpdated(oldDAO, newDAO);
    }

    function setPriceOracle(address newOracle) external onlyDAO {
        if (newOracle == address(0)) revert InvalidAddress();
        address oldOracle = address(priceOracle);
        priceOracle = IPriceOracle(newOracle);
        emit PriceOracleUpdated(oldOracle, newOracle);
    }
}
