// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Contract for managing file uploads and access control
contract Upload {

    // Struct to represent access permissions for a user
    struct Access {
        address user; // Address of the user
        bool access;  // Access status: true (granted) or false (revoked)
    }

    // Mapping to store uploaded file URLs for each user
    mapping (address => string[]) value;

    // Mapping to track ownership permissions between users
    mapping (address => mapping (address => bool)) ownership;

    // Mapping to store the access list for each user
    mapping(address => Access[]) accessList;

    // Mapping to track if access data has been previously set
    mapping(address => mapping (address => bool)) previousData;

    // Function to add a file URL for a user
    function add(address _user, string memory url) external {
        value[_user].push(url); // Add the URL to the user's list
    }

    // Function to allow access to another user
    function allow(address user) external {
        ownership[msg.sender][user] = true; // Grant ownership access to the user

        // Check if access data already exists
        if (previousData[msg.sender][user]) {
            // Update access status if the user is already in the access list
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true; // Grant access
                }
            }
        } else {
            // Add the user to the access list if not already present
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true; // Mark as previously set
        }
    }

    // Function to revoke access from a user
    function disAllow(address user) public {
        ownership[msg.sender][user] = false; // Revoke ownership access

        // Update access status in the access list
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false; // Revoke access
            }
        }
    }

    // Function to display the file URLs of a user
    function display(address _user) external view returns (string[] memory) {
        // Ensure the caller has access to the user's files
        require(_user == msg.sender || ownership[_user][msg.sender], "You dont have Access");
        return value[_user]; // Return the user's file URLs
    }

    // Function to view the access list of the caller
    function ShareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender]; // Return the caller's access list
    }
}