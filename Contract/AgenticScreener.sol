//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgenticScreener {
    struct Job {
        string openingURL;
        address poster;
    }

    address public owner;
    uint256 public listingFee = 10 ether / 1000; // 10$ in ETH (assuming 1 ETH = $1000 for simplicity)
    uint256 public freeListingLimit = 5;

    Job[] public jobListings;
    mapping(address => uint256) public listingCount;

    event JobListed(string openingURL, address indexed poster, uint256 listingId);
    event FeePaid(address indexed payer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addJobListing(string calldata _openingURL) external payable {
        if (listingCount[msg.sender] >= freeListingLimit) {
            require(msg.value >= listingFee, "Insufficient fee for new listing");
            
            // Transfer the fee to the contract owner
            (bool success, ) = owner.call{value: msg.value}("");
            require(success, "Fee transfer failed");
            
            emit FeePaid(msg.sender, msg.value);
        }

        // Create and store the new job listing
        jobListings.push(Job({
            openingURL: _openingURL,
            poster: msg.sender
        }));
        
        listingCount[msg.sender]++;
        
        emit JobListed(_openingURL, msg.sender, jobListings.length - 1);
    }

    function getAllJobListings() external view returns (Job[] memory) {
        return jobListings;
    }

    function getJobListingsByAddress(address _poster) external view returns (Job[] memory) {
        // First count the number of listings by this address
        uint256 count = 0;
        for (uint256 i = 0; i < jobListings.length; i++) {
            if (jobListings[i].poster == _poster) {
                count++;
            }
        }

        // Then create and populate the result array
        Job[] memory result = new Job[](count);
        uint256 resultIndex = 0;
        for (uint256 i = 0; i < jobListings.length; i++) {
            if (jobListings[i].poster == _poster) {
                result[resultIndex] = jobListings[i];
                resultIndex++;
            }
        }

        return result;
    }

    // Allow the owner to update the listing fee
    function updateListingFee(uint256 _newFee) external onlyOwner {
        listingFee = _newFee;
    }

    // Allow the owner to update the free listing limit
    function updateFreeListingLimit(uint256 _newLimit) external onlyOwner {
        freeListingLimit = _newLimit;
    }
}
