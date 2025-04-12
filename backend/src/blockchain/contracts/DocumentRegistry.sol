// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DocumentRegistry
 * @dev Registers and verifies documents on the blockchain
 */
contract DocumentRegistry {
    struct Document {
        string documentId;
        string did;
        string documentType;
        string contentHash;
        address issuer;
        uint256 issuedAt;
        bool valid;
    }
    
    // Mapping from document ID to Document struct
    mapping(string => Document) private documents;
    
    // Mapping from DID to document IDs
    mapping(string => string[]) private didDocuments;
    
    // Events
    event DocumentRegistered(string documentId, string did, string documentType, address issuer);
    event DocumentRevoked(string documentId, string did, address issuer);
    
    /**
     * @dev Register a new document
     * @param _documentId Document ID (unique identifier)
     * @param _did DID of the identity owner
     * @param _documentType Type of document
     * @param _contentHash IPFS hash of document content/metadata
     */
    function registerDocument(
        string memory _documentId, 
        string memory _did, 
        string memory _documentType, 
        string memory _contentHash
    ) public {
        require(bytes(documents[_documentId].documentId).length == 0, "Document ID already registered");
        
        documents[_documentId] = Document({
            documentId: _documentId,
            did: _did,
            documentType: _documentType,
            contentHash: _contentHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            valid: true
        });
        
        didDocuments[_did].push(_documentId);
        
        emit DocumentRegistered(_documentId, _did, _documentType, msg.sender);
    }
    
    /**
     * @dev Revoke a document
     * @param _documentId Document ID to revoke
     */
    function revokeDocument(string memory _documentId) public {
        require(bytes(documents[_documentId].documentId).length > 0, "Document not found");
        require(documents[_documentId].issuer == msg.sender, "Only issuer can revoke document");
        require(documents[_documentId].valid, "Document is already revoked");
        
        documents[_documentId].valid = false;
        
        emit DocumentRevoked(_documentId, documents[_documentId].did, msg.sender);
    }
    
    /**
     * @dev Check if a document is valid
     * @param _documentId Document ID to check
     * @return bool True if document is valid
     */
    function isDocumentValid(string memory _documentId) public view returns (bool) {
        if (bytes(documents[_documentId].documentId).length == 0) {
            return false;
        }
        
        return documents[_documentId].valid;
    }
    
    /**
     * @dev Get document details
     * @param _documentId Document ID to lookup
     * @return Document Document data
     */
    function getDocumentDetails(string memory _documentId) public view returns (Document memory) {
        require(bytes(documents[_documentId].documentId).length > 0, "Document not found");
        
        return documents[_documentId];
    }
    
    /**
     * @dev Get all documents for a DID
     * @param _did DID to lookup
     * @return string[] Array of document IDs
     */
    function getDocumentsByDID(string memory _did) public view returns (string[] memory) {
        return didDocuments[_did];
    }
}