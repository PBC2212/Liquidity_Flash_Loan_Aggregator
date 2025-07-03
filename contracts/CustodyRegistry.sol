// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CustodyRegistry
 * @dev Tracks custody, compliance, and off-chain verification for asset tokens.
 */
contract CustodyRegistry is Ownable {
    struct ComplianceStatus {
        bool kycCompleted;
        bool amlCompleted;
        bool inspectionPassed;
        bool titleVerified;
        bool custodyConfirmed;
        uint256 lastUpdated;
    }

    struct AssetCustodyInfo {
        string assetDescription; // e.g. "123 Main St, NY"
        uint256 chainId;         // EVM chain ID
        address custodyAddress;  // Address holding the asset token
        address defiProtocol;    // DeFi protocol contract (if deposited)
        string custodyType;      // e.g. "Escrow", "SPV", "Vault"
        string offchainDocs;     // IPFS hash or URL to docs (title, inspection, etc.)
        ComplianceStatus compliance;
    }

    mapping(address => AssetCustodyInfo) public assetInfo; // token => info

    address public dao;

    event AssetRegistered(address indexed token, AssetCustodyInfo info);
    event ComplianceUpdated(address indexed token, ComplianceStatus status);

    modifier onlyDAOorOwner() {
        require(msg.sender == owner() || msg.sender == dao, "Not authorized");
        _;
    }

    // FIXED: Proper constructor with initialOwner parameter
    constructor(address _dao) Ownable(_dao) {
        require(_dao != address(0), "Invalid DAO");
        dao = _dao;
    }

    function registerAsset(
        address token,
        string calldata description,
        uint256 chainId,
        address custodyAddress,
        address defiProtocol,
        string calldata custodyType,
        string calldata offchainDocs
    ) external onlyDAOorOwner {
        AssetCustodyInfo storage info = assetInfo[token];
        info.assetDescription = description;
        info.chainId = chainId;
        info.custodyAddress = custodyAddress;
        info.defiProtocol = defiProtocol;
        info.custodyType = custodyType;
        info.offchainDocs = offchainDocs;
        emit AssetRegistered(token, info);
    }

    function updateCompliance(
        address token,
        bool kyc,
        bool aml,
        bool inspection,
        bool title,
        bool custody
    ) external onlyDAOorOwner {
        ComplianceStatus memory status = ComplianceStatus({
            kycCompleted: kyc,
            amlCompleted: aml,
            inspectionPassed: inspection,
            titleVerified: title,
            custodyConfirmed: custody,
            lastUpdated: block.timestamp
        });
        assetInfo[token].compliance = status;
        emit ComplianceUpdated(token, status);
    }

    function getAssetInfo(address token) external view returns (AssetCustodyInfo memory) {
        return assetInfo[token];
    }

    function isAssetCompliant(address token) external view returns (bool) {
        ComplianceStatus memory c = assetInfo[token].compliance;
        return c.kycCompleted && c.amlCompleted && c.inspectionPassed && c.titleVerified && c.custodyConfirmed;
    }
}