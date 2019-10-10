pragma solidity ^0.5.3;

contract IncidentReport {

    enum IncidentStatus { REPORTED, ACKNOWLEDGED, SOLVED }

    struct Report {
        address reporter;
        string ipfsHash;
        uint32 dateReported;
        IncidentStatus status;
        uint32 dateAcked;
        uint32 dateSolved;
        bool anon;
    }
    
    mapping(uint => Report) public reports;
    mapping(address => string) public users;
	mapping (address => bool) public admins;
	mapping(address => uint256) public balanceOf;

    uint public reportCount;
    
    function compareStringsbyBytes(string memory s1, string memory s2) internal pure returns(bool){
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
    
	constructor () public {
		admins[msg.sender] = true;
		users[msg.sender] = "admin";
	}

    function addUser (string memory _userId) public {
		require(compareStringsbyBytes(users[msg.sender], ""));
		require(!compareStringsbyBytes(_userId, ""));
        users[msg.sender] = _userId;
		balanceOf[msg.sender] += 2;
    }

    function issueReport (string memory _hash, bool _anon) public {
        require(balanceOf[msg.sender] >= 1);
        balanceOf[msg.sender] -= 1;
        reportCount ++;
        reports[reportCount] = Report(msg.sender, _hash, uint32(now), IncidentStatus.REPORTED, 0, 0, _anon);
    }
   
    function ackReport (uint64 _reportId) public {
		require(admins[msg.sender]);
        Report storage report = reports[_reportId];
        require(report.status == IncidentStatus.REPORTED);
        balanceOf[report.reporter] += 1;
        reports[_reportId].status = IncidentStatus.ACKNOWLEDGED;
        reports[_reportId].dateAcked = uint32(now);
    }
   
    function solveReport (uint64 _reportId) public {
		require(admins[msg.sender]);
        Report storage report = reports[_reportId];
		require(report.status == IncidentStatus.ACKNOWLEDGED);
        balanceOf[report.reporter] += 5;
        reports[_reportId].status = IncidentStatus.SOLVED;
        reports[_reportId].dateSolved = uint32(now);
    }
	function addAdmin (address _newAdmin) public {
		require(admins[msg.sender]);
		require(!admins[_newAdmin]);
		admins[_newAdmin] = true;
	}   
}

