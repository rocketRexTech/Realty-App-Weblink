//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
// state variables: keeps track of blockchain address.
    address public nftAddress; // store smart contract address for the nft for this particular real estate transaction. 
    address payable public seller; // the person whose going to receive crypto in transaction so make their address (payable).
    address public inspector;
    address public lender;

// make sure only surtain people can run certain functions with a modifier
    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

// mapping to update listing on a per nft basis.
    mapping(uint256 => bool) public isListed; // uint256(1) is the id of the nft, bool is if its true or not which will tell us if the property is listed.
    mapping(uint256 => uint256) public purchasePrice; //uint256(1) is the id of the nft, uint256(2) is the amount is cost to buy the house.
    mapping(uint256 => uint256) public escrowAmount; //uint256(1) is the id of the nft, uint256(2) is the escrow amount.
    mapping(uint256 => address) public buyer; //uint256(1) is the id of the nft, address is the address of buyer.
    mapping(uint256 => bool) public inspectionPass; // by defaul mapping passes false bool.
    // mapping of the address of the persons approving.
    mapping(uint256 => mapping(address => bool)) public approval; //nested mapping.

// set state variables in constructor function. (only run once when the smart contact is deployed to the blockchain).
    constructor(address _nftAddress, 
        address payable _seller, 
        address _inspector, 
        address _lender
    ){
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

// listing a property (take the ntf out of the users wallet and move it into escrow).
// set the price for the nft/property.
// put in the escrow amount.
    function list(
        uint256 _nftID, 
        address _buyer, 
        uint256 _purchasePrice, 
        uint256 _escrowAmount) public payable onlySeller {
        // transfer nft from seller to this contract.
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        // update and assign value to mapping.
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

// put under contract (only buyer - payable escrow).
    function depositeEarnest(uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID]);
    }

// update inspection statues
    function updateInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPass[_nftID] = _passed;
    }

// approve sale (update approval mapping)
    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

// finalize sale
// -> require inspection status (add more items here like appraisal)
// -> require sale to be authorized
// -> require funds to be the correct amount
// -> transfer nft to buyer
// -> transfer fund to seller
    function finalizeSale(uint256 _nftID) public {
        require(inspectionPass[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        isListed[_nftID] = false;

    // transfering ether from the smart contract to the seller
        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);

    // transfer nft ownership to buyer.
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

// Cancle sale (handle earnest deposit).
// -> is inspection status is not approved, then refund, otherwise send to seller.
// !!!!!!!!! learn how to run my own test for this !!!!!!!!!
    function cancelSale(uint256 _nftID) public {
        if(inspectionPass[_nftID] == false) {
            payable(buyer[_nftID]).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    // lets the smart contract receive ether.
    receive() external payable {}

// address(this) is address on the smart contract and .balance gives you the ether balance.
    function getBalance() public view returns (uint256) {
        return address(this).balance; 
    }


}


