// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdemyIdentity {
    struct Student {
        string name;
        string university;
        string email;
        uint reputation;
        bool exists;
    }
    
    mapping(address => Student) private students;
    
    event IdentityCreated(address indexed student, string name, string university, string email);
    event ReputationUpdated(address indexed student, uint newReputation);
    
    // Allow students to create their identity
    function createIdentity(string memory _name, string memory _university, string memory _email) public {
        require(!students[msg.sender].exists, "Identity already exists");
        students[msg.sender] = Student({
            name: _name,
            university: _university,
            email: _email,
            reputation: 0,
            exists: true
        });
        
        emit IdentityCreated(msg.sender, _name, _university, _email);
    }
    
    // Allow updating a student's reputation (no access control for demo purposes)
    function updateReputation(address _student, uint _newReputation) public {
        require(students[_student].exists, "Identity does not exist");
        students[_student].reputation = _newReputation;
        emit ReputationUpdated(_student, _newReputation);
    }
    
    // Fetch student details
    function getStudent(address _student) public view returns (string memory, string memory, string memory, uint) {
        require(students[_student].exists, "Identity does not exist");
        Student memory student = students[_student];
        return (student.name, student.university, student.email, student.reputation);
    }
}