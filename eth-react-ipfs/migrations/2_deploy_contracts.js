var IncidentReport = artifacts.require("./IncidentReport.sol");

module.exports = function(deployer) {
  deployer.deploy(IncidentReport);
};
