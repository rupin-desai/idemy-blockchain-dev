// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title IDCard
 * @dev NFT implementation for digital identity cards
 */
contract IDCard is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Identity contract address 
    address public identityContractAddress;
    
    // Mapping from tokenId to DID
    mapping(uint256 => string) private _tokenToDID;
    
    // Mapping from DID to tokenId
    mapping(string => uint256) private _didToToken;
    
    // Mapping for document links
    mapping(uint256 => string[]) private _tokenToDocuments;
    
    // Events
    event IDCardMinted(uint256 tokenId, string did, address owner);
    event DocumentLinked(uint256 tokenId, string documentId);
    
    /**
     * @dev Initialize the contract with Identity contract address
     * @param _identityContractAddress Address of the Identity contract
     */
    constructor(address _identityContractAddress) ERC721("Digital Identity Card", "IDC") {
        identityContractAddress = _identityContractAddress;
    }
    
    /**
     * @dev Mint a new ID card NFT
     * @param _to Address to mint the token to
     * @param _did DID of the identity
     * @param _tokenURI URI of the token metadata
     * @return uint256 Minted token ID
     */
    function mintIDCard(address _to, string memory _did, string memory _tokenURI) public returns (uint256) {
        require(_didToToken[_did] == 0, "ID card already exists for this DID");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        _tokenToDID[newTokenId] = _did;
        _didToToken[_did] = newTokenId;
        
        emit IDCardMinted(newTokenId, _did, _to);
        
        return newTokenId;
    }
    
    /**
     * @dev Link a document to an ID card
     * @param _tokenId Token ID of the ID card
     * @param _documentId Document ID to link
     */
    function linkDocument(uint256 _tokenId, string memory _documentId) public {
        require(_exists(_tokenId), "ID card does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the owner of the ID card");
        
        _tokenToDocuments[_tokenId].push(_documentId);
        
        emit DocumentLinked(_tokenId, _documentId);
    }
    
    /**
     * @dev Get token ID by DID
     * @param _did DID to lookup
     * @return uint256 Token ID
     */
    function getTokenByDID(string memory _did) public view returns (uint256) {
        uint256 tokenId = _didToToken[_did];
        require(tokenId != 0, "No ID card found for this DID");
        
        return tokenId;
    }
    
    /**
     * @dev Get DID by token ID
     * @param _tokenId Token ID to lookup
     * @return string DID
     */
    function getDIDByToken(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "ID card does not exist");
        
        return _tokenToDID[_tokenId];
    }
    
    /**
     * @dev Get linked documents
     * @param _tokenId Token ID to lookup
     * @return string[] Array of document IDs
     */
    function getLinkedDocuments(uint256 _tokenId) public view returns (string[] memory) {
        require(_exists(_tokenId), "ID card does not exist");
        
        return _tokenToDocuments[_tokenId];
    }
}