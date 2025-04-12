// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Identity
 * @dev Stores self-sovereign identity information on the blockchain
 */
contract Identity {
    struct IdentityData {
        string did;
        address owner;
        uint256 createdAt;
        bool active;
        string metadataHash;
    }
    
    // Mapping from owner address to identity data
    mapping(address => IdentityData) private identities;
    
    // Mapping from DID to owner address (for lookup)
    mapping(string => address) private didToOwner;
    
    // Events
    event IdentityCreated(string did, address indexed owner, string metadataHash);
    event IdentityUpdated(string did, address indexed owner, string metadataHash);
    event IdentityStatusChanged(string did, address indexed owner, bool active);
    
    /**
     * @dev Create a new identity
     * @param _did Decentralized Identifier
     * @param _metadataHash IPFS hash of identity metadata
     */
    function createIdentity(string memory _did, string memory _metadataHash) public {
        require(bytes(identities[msg.sender].did).length == 0, "Identity already exists for this address");
        require(didToOwner[_did] == address(0), "DID already registered");
        
        identities[msg.sender] = IdentityData({
            did: _did,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true,
            metadataHash: _metadataHash
        });
        
        didToOwner[_did] = msg.sender;
        
        emit IdentityCreated(_did, msg.sender, _metadataHash);
    }
    
    /**
     * @dev Update identity metadata
     * @param _metadataHash New IPFS hash of identity metadata
     */
    function updateIdentity(string memory _metadataHash) public {
        require(bytes(identities[msg.sender].did).length > 0, "No identity found for this address");
        require(identities[msg.sender].active, "Identity is not active");
        
        identities[msg.sender].metadataHash = _metadataHash;
        
        emit IdentityUpdated(identities[msg.sender].did, msg.sender, _metadataHash);
    }
    
    /**
     * @dev Deactivate identity
     */
    function deactivateIdentity() public {
        require(bytes(identities[msg.sender].did).length > 0, "No identity found for this address");
        require(identities[msg.sender].active, "Identity already deactivated");
        
        identities[msg.sender].active = false;
        
        emit IdentityStatusChanged(identities[msg.sender].did, msg.sender, false);
    }
    
    /**
     * @dev Reactivate identity
     */
    function reactivateIdentity() public {
        require(bytes(identities[msg.sender].did).length > 0, "No identity found for this address");
        require(!identities[msg.sender].active, "Identity is already active");
        
        identities[msg.sender].active = true;
        
        emit IdentityStatusChanged(identities[msg.sender].did, msg.sender, true);
    }
    
    /**
     * @dev Check if a DID exists
     * @param _did DID to check
     * @return bool True if DID exists
     */
    function didExists(string memory _did) public view returns (bool) {
        return didToOwner[_did] != address(0);
    }
    
    /**
     * @dev Get identity by DID
     * @param _did DID to lookup
     * @return IdentityData Identity data
     */
    function getIdentityByDid(string memory _did) public view returns (IdentityData memory) {
        address owner = didToOwner[_did];
        require(owner != address(0), "DID not found");
        
        return identities[owner];
    }
    
    /**
     * @dev Get identity by address
     * @param _address Address to lookup
     * @return IdentityData Identity data
     */
    function getIdentity(address _address) public view returns (IdentityData memory) {
        return identities[_address];
    }
}