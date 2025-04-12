// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IDCard
 * @dev Simplified NFT implementation for digital identity cards
 */
contract IDCard {
    // Token counter
    uint256 private _tokenIdCounter;
    
    // Identity contract address 
    address public identityContractAddress;
    
    // Token data
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    
    // Mapping from tokenId to DID
    mapping(uint256 => string) private _tokenToDID;
    
    // Mapping from DID to tokenId
    mapping(string => uint256) private _didToToken;
    
    // Mapping for document links
    mapping(uint256 => string[]) private _tokenToDocuments;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event IDCardMinted(uint256 tokenId, string did, address owner);
    event DocumentLinked(uint256 tokenId, string documentId);
    
    /**
     * @dev Initialize the contract
     * @param _identityContractAddress Address of the Identity contract
     */
    constructor(address _identityContractAddress) {
        identityContractAddress = _identityContractAddress;
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Mint a new ID card NFT
     * @param to Address to mint the token to
     * @param did DID of the identity
     * @param uri URI of the token metadata
     * @return tokenId of the newly minted token
     */
    function mintIDCard(address to, string memory did, string memory uri) public returns (uint256) {
        require(_didToToken[did] == 0, "IDCard: ID card already exists for this DID");
        
        uint256 newTokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        _tokenToDID[newTokenId] = did;
        _didToToken[did] = newTokenId;
        
        emit IDCardMinted(newTokenId, did, to);
        
        return newTokenId;
    }
    
    /**
     * @dev Link document to ID card
     * @param tokenId ID card token ID
     * @param documentId Document ID to link
     */
    function linkDocument(uint256 tokenId, string memory documentId) public {
        require(_exists(tokenId), "IDCard: token does not exist");
        require(ownerOf(tokenId) == msg.sender, "IDCard: caller is not the owner");
        
        _tokenToDocuments[tokenId].push(documentId);
        emit DocumentLinked(tokenId, documentId);
    }
    
    /**
     * @dev Get token by DID
     * @param did Identity DID
     * @return tokenId associated with the DID
     */
    function getTokenByDID(string memory did) public view returns (uint256) {
        uint256 tokenId = _didToToken[did];
        require(tokenId != 0, "IDCard: no token found for this DID");
        return tokenId;
    }
    
    /**
     * @dev Get DID by token ID
     * @param tokenId Token ID
     * @return DID associated with the token
     */
    function getDIDByToken(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "IDCard: token does not exist");
        return _tokenToDID[tokenId];
    }
    
    /**
     * @dev Get linked documents
     * @param tokenId Token ID
     * @return Array of linked document IDs
     */
    function getLinkedDocuments(uint256 tokenId) public view returns (string[] memory) {
        require(_exists(tokenId), "IDCard: token does not exist");
        return _tokenToDocuments[tokenId];
    }
    
    /**
     * @dev Internal function to mint a new token
     * @param to The address that will own the minted token
     * @param tokenId The token ID to mint
     */
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "IDCard: mint to the zero address");
        require(!_exists(tokenId), "IDCard: token already minted");
        
        _owners[tokenId] = to;
        _balances[to]++;
        
        emit Transfer(address(0), to, tokenId);
    }
    
    /**
     * @dev Check if token exists
     * @param tokenId Token ID to check
     * @return bool True if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }
    
    /**
     * @dev Get token owner
     * @param tokenId Token ID
     * @return address Owner of the token
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "IDCard: invalid token ID");
        return owner;
    }
    
    /**
     * @dev Set token URI
     * @param tokenId Token ID
     * @param uri Token URI
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_exists(tokenId), "IDCard: URI set for nonexistent token");
        _tokenURIs[tokenId] = uri;
    }
    
    /**
     * @dev Get token URI
     * @param tokenId Token ID
     * @return string Token URI
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "IDCard: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
