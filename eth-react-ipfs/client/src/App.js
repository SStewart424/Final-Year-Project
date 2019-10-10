import React, { Component } from "react";
import IncidentReportContract from "./contracts/IncidentReport.json";
import getWeb3 from './utils/getWeb3';
import {
		Route,  
		HashRouter
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import ReportList from "./ReportList.js";
import ReportForm from "./ReportForm.js";
import Home from "./Home.js";
import AdminPanel from "./AdminPanel.js";
import CryptoJS from "crypto-js";

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
 
class App extends Component {

	componentDidMount() {
		this.loadBlockchainData();
	}
	
	constructor(props) {
		super(props)
		this.state = { 
			reports: [],
			account: '',
			reportCount: 0,
			admin: false,
			aesKey: "secretKey",
			rewardTokens: 0, 
			titles: []
		}
		this.createReport = this.createReport.bind(this)
		this.createAdmin = this.createAdmin.bind(this)
		this.ackReport = this.ackReport.bind(this)
		this.solveReport = this.solveReport.bind(this)
		this.addUser = this.addUser.bind(this)
		this.loadReportData = this.loadReportData.bind(this)
	}

	loadBlockchainData = async () =>{
		try{
			const web3 = await getWeb3()
			const accounts = await web3.eth.getAccounts()
			this.setState({account: accounts[0]})
			const networkId = await web3.eth.net.getId()
			const IRdeployedNetwork = IncidentReportContract.networks[networkId]
			if(IRdeployedNetwork){	
				const incidentReport = new web3.eth.Contract(IncidentReportContract.abi, IRdeployedNetwork && IRdeployedNetwork.address)
				this.setState({incidentReport})
				const admin = await incidentReport.methods.admins(this.state.account).call()
				this.setState({admin})
				const rewardTokens = await incidentReport.methods.balanceOf(this.state.account).call()
				this.setState({rewardTokens: rewardTokens.toNumber()})
				let username = await this.state.incidentReport.methods.users(this.state.account).call()
				if(username === ""){
					this.setState({firstTime: true})
				}else{
					this.setState({firstTime: false})
				}
				const reportCount = await incidentReport.methods.reportCount().call()
				this.setState ({ reportCount })
				for (var i=1; i <= reportCount; i++){
					const report = await incidentReport.methods.reports(i).call()
					this.setState({reports: [...this.state.reports, report ]})
					if(report.anon && !this.state.admin){
						this.setState({titles: [...this.state.titles, "Anonymous"]})
					}else if(report.anon){
						var json = await ipfs.catJSON(report.ipfsHash)
						var title= json.title
						this.setState({titles: [...this.state.titles, CryptoJS.AES.decrypt(title, this.state.aesKey).toString(CryptoJS.enc.Utf8) ]})
					} else{
						var json2 = await ipfs.catJSON(report.ipfsHash)
						var title2= json2.title
						this.setState({titles: [...this.state.titles, title2 ]})
						console.log(title2)
					}
				}
	
				console.log(this.state.reports)
				console.log(this.state.titles)
			}else {
     			window.alert('contract not deployed to detected network.')
			}
		} catch(error) {
				alert('Failed to load web3, accounts or incidentReportContract');
				console.error(error);
		}

	}
	loadReportData = async () =>{

	}
	
	createAdmin(adminAdress){
		this.state.incidentReport.methods.addAdmin(adminAdress).send({ from: this.state.account })
	}

	createReport(hash, anon){
		this.state.incidentReport.methods.issueReport(hash, anon).send({ from: this.state.account })	
	}	

	ackReport(reportID){
		this.state.incidentReport.methods.ackReport(reportID).send({ from: this.state.account })
	}

	solveReport(reportID){
		this.state.incidentReport.methods.solveReport(reportID).send({ from: this.state.account })
	}
	
	addUser(userName){
		this.state.incidentReport.methods.addUser(userName).send({ from: this.state.account})
	}
	
  	render() {
        const appNavbar = (
		<Navbar bg="light" expand="lg">
		  <Navbar.Brand>University Incident Reporting System</Navbar.Brand>
		  <Navbar.Toggle aria-controls="basic-navbar-nav" />
		  <Navbar.Collapse id="basic-navbar-nav">
		    <Nav className="mr-auto">
		      <Nav.Link exact href="#/">Home</Nav.Link>
		      <Nav.Link href="#form">Submit A Report</Nav.Link>
		      <Nav.Link href="#list">View Incidents</Nav.Link>
		      <Nav.Link href="#adminpanel">Admin Panel</Nav.Link>
		    </Nav>
		  </Navbar.Collapse>
		</Navbar>
        );
    return (
	<HashRouter>
	<div>	
    	{appNavbar}
		<div>
			<Route exact path="/" render={(props) => <Home account={this.state.account} admin={this.state.admin} tokens={this.state.rewardTokens} addUser={this.addUser} firstTime={this.state.firstTime}/>} />
			<Route path="/form" render={(props) => <ReportForm createReport={this.createReport} tokens={this.state.rewardTokens} aesKey={this.state.aesKey}/>} />
			<Route path="/list" render={(props) => <ReportList reports={this.state.reports} admin={this.state.admin} titles={this.state.titles} reportCount={this.state.reportCount} />} />
			<Route path="/adminpanel" render ={(props) => <AdminPanel createAdmin={this.createAdmin} ackReport={this.ackReport} solveReport={this.solveReport} admin={this.state.admin} />}/>
		</div>
	</div>
	</HashRouter>
    	);
  }
}

export default App;
