// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./OptimisticOracleV2Interface.sol";

contract VolatilityMarket {
    OptimisticOracleV2Interface oo =
        OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);

    // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.
    bytes32 public identifier = bytes32("VIX");

    // Post the question in ancillary data. Note that this is a simplified form of ancillry data to work as an example. A real
    // world prodition market would use something slightly more complex and would need to conform to a more robust structure.
    bytes public ancillaryData =
        bytes(
            "https://snapshot.org/#/volatilityprotocol.eth/proposal/0xe9a7dc5c9ccab0a1369440fa887bb50672fa80a50e44182f0a170680499bcaa3"
        );

    uint256 public requestTime = 0; // Store the request time so we can re-use it later.

    address public owner;

    IERC20 public token;

    uint256 public disposableFunds = 0 ether;
    uint256 public requiredFunds = 1 wei;
    uint256 public blockBuffer = 10 minutes;
    uint256 public ticketCount = 0;

    uint256 public ticketCounter = 0;

    enum Direction {
        NONE,
        UP,
        DOWN
    }

    struct ticket {
        uint256 id;
        address owner;
        uint256 betTime;
        uint256 verifyTime;
        uint256 amount;
        Direction direction;
        bool claimed;
    }

    mapping(uint256 => ticket) public tickets;

    event TicketCreated(uint256 id, address user);

    constructor(address _token) {
        token = IERC20(_token);
    }

    //functions that will directly be invoked from the frontend

    function createBet(uint256 amount, Direction direction) public {
        token.transferFrom(msg.sender, address(this), amount);
        uint256 id = uint256(
            keccak256(abi.encodePacked(msg.sender, block.timestamp))
        );
        tickets[id] = ticket(
            id,
            msg.sender,
            block.timestamp,
            block.timestamp,
            amount,
            direction,
            false
        );
        requestData();
        emit TicketCreated(id, msg.sender);
    }

    function getTicket(uint256 _id)
        public
        returns (
            uint256 id,
            address owner_,
            uint256 betTime,
            uint256 verifyTime,
            uint256 amount,
            Direction direction,
            bool claimed
        )
    {
        return (
            tickets[_id].id,
            tickets[_id].owner,
            tickets[_id].betTime,
            tickets[_id].verifyTime,
            tickets[_id].amount,
            tickets[_id].direction,
            tickets[_id].claimed
        );
    }

    function verifyBet(uint256 id) public {
        ticket storage currentTicket = tickets[id];
        require(msg.sender == currentTicket.owner, "First Check");
        require(
            block.timestamp < (currentTicket.betTime + blockBuffer),
            "Second Check"
        );
        currentTicket.verifyTime = block.timestamp;
        requestData();
    }

    //Ticket is redeemed only within the time period
    function redeemTicket(uint256 id) public {
        ticket memory currentTicket = tickets[id];
        require(currentTicket.claimed == false, "Ticket claim require");
        require(msg.sender == currentTicket.owner, "Owner require check");
        require(
            currentTicket.verifyTime > currentTicket.betTime,
            "TImestamp require check"
        );
        require(currentTicket.amount < disposableFunds, "Enough Funds require");

        Direction choice = currentTicket.direction;

        int256 oldPrice = oo
            .getRequest(
                address(this),
                identifier,
                currentTicket.betTime,
                ancillaryData
            )
            .resolvedPrice;
        int256 newPrice = oo
            .getRequest(
                address(this),
                identifier,
                currentTicket.verifyTime,
                ancillaryData
            )
            .resolvedPrice;

        if (
            ((choice == Direction.UP) && (oldPrice < newPrice)) ||
            ((choice == Direction.DOWN) && (oldPrice > newPrice))
        ) {
            token.transfer(msg.sender, currentTicket.amount * 2);
            disposableFunds = disposableFunds - (currentTicket.amount);
            currentTicket.claimed = true;
        }
    }

    function collectDeadTickets(uint256[] calldata ids) external {
        uint256 i = 0;
        while (i < ids.length) {
            ticket memory currentTicket = tickets[ids[i]];
            disposableFunds = disposableFunds + currentTicket.amount;
        }
    }

    // Create an Optimistic oracle instance at the deployed address on Görli.

    // Submit a data request to the Optimistic oracle.
    function requestData() public {
        requestTime = block.timestamp; // Set the request time to the current block time.
        uint256 reward = 0; // Set the reward to 0 (so we dont have to fund it from this contract).

        // Now, make the price request to the Optimistic oracle and set the liveness to 30 so it will settle quickly.
        oo.requestPrice(
            identifier,
            block.timestamp,
            ancillaryData,
            token,
            reward
        );
        oo.setCustomLiveness(identifier, requestTime, ancillaryData, 30);
    }

    // Settle the request once it's gone through the liveness period of 30 seconds. This acts the finalize the voted on price.
    // In a real world use of the Optimistic Oracle this should be longer to give time to disputers to catch bat price proposals.
    function settleRequest() public {
        oo.settle(address(this), identifier, requestTime, ancillaryData);
    }

    // Fetch the resolved price from the Optimistic Oracle that was settled.
    function getSettledData() public view returns (int256) {
        return
            oo
                .getRequest(
                    address(this),
                    identifier,
                    requestTime,
                    ancillaryData
                )
                .resolvedPrice;
    }
}
