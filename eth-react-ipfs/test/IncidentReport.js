var IncidentReport = artifacts.require('./IncidentReport.sol');
const utils = require('tn-truffle-test-utils')

contract('IncidentReport', function(accounts) {
  var incidentReportInstance;
  var admin = accounts[0];
  var reporter = accounts[1];
  var newAdmin = accounts[2];
  var reporter2 = accounts[3];
  it('initializes the contract with the correct values', function() {
    return IncidentReport.deployed().then(function(instance) {
      incidentReportInstance = instance;
      return incidentReportInstance.address
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return incidentReportInstance.admins(admin);
    }).then(function(success) {
      assert.equal(success, true, 'contract creator is admin');
      return incidentReportInstance.users(admin);
    }).then(function(userName) {
      assert.equal(userName, "admin", "contract creator has been added as user-admin");
    });
  });

  it('Add user, issue + ack + solve report', async () => {
		let instance = await IncidentReport.deployed();
		let adminBalance = await instance.balanceOf(admin);
		let reporterBalance1 = await instance.balanceOf(reporter);
		assert.equal(reporterBalance1, 0 ,"initial balance incorrect");
		await instance.addUser( "ss01393", {from: reporter});
		let reporterBalance2 = await instance.balanceOf(reporter);
		assert.equal(reporterBalance2, 2 ,"balance incorrect after adding user");
		await instance.issueReport("test", false, {from:reporter});
		let reporterBalance3 = await instance.balanceOf(reporter);
		assert.equal(reporterBalance3, 1 ,"balance incorrect after issuing report");
		let reportCheck = await instance.reports(1);
		assert.equal(reportCheck.status, 0 ,"report not issued");
		await instance.ackReport(1, {from:admin});
		let reporterBalance4 = await instance.balanceOf(reporter);
		assert.equal(reporterBalance4, 2 ,"balance incorrect after acking report");
		let ackCheck = await instance.reports(1);
		assert.equal(ackCheck.status, 1 ,"report not acknowledged");
		await instance.solveReport(1, "solved", {from:admin});
		let reporterBalance5 = await instance.balanceOf(reporter);
		assert.equal(reporterBalance5, 7 ,"balance incorrect after solving report");
		let solveCheck = await instance.reports(1);
		assert.equal(solveCheck.status, 2 ,"report not solved");
  });
  
  it('Stop incorrect function calls', async () => {
		let instance = await IncidentReport.deployed();
		await utils.assertThrows(instance.addUser("admin", {from: admin}));
		await utils.assertThrows(instance.issueReport("test",true,{from:admin}));
		await utils.assertThrows(instance.issueReport("test",true,{from: reporter2}));
		await instance.addUser("ss01393", {from:reporter2});
		await instance.issueReport("test",true, {from:reporter2});
		await utils.assertThrows(instance.ackReport(1,{from:reporter2}));
		await utils.assertThrows(instance.solveReport(1,"solved",{from:admin}));
		await utils.assertThrows(instance.solveReport(1,"solved", {from:reporter2}));
		await utils.assertThrows(instance.addAdmin(newAdmin, {from:reporter2}));
  });
});
