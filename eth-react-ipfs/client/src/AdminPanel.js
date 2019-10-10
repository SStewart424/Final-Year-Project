import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
class AdminPanel extends Component {
	constructor(props){
		super(props);
		this.showPage = this.props.admin;
	}

  	render() {
if (!this.showPage) {
			return(
			<Jumbotron>
				<h1> This page is for admin use only Please use the navigation bar at the top to find what you are looking for </h1>
			</Jumbotron> );
		} else { 
			return(
			<div>
				<div>
					<form onSubmit={(event) =>{
						event.preventDefault()
						this.props.createAdmin(this.adminAddress.value)}}>
  						<label> 
							Address of new Admin:
							<input ref ={(address) => this.adminAddress = address} type="text" name="address" />
						</label>
						<input type="submit" value="Submit" />
					</form>
				</div>
				<div>
					<form onSubmit={(event) =>{
						event.preventDefault()
						this.props.ackReport(this.reportID.value)}}>
  						<label> 
							ID of Report to Acknowledge:
							<input ref ={(id) => this.reportID = id} type="text" name="id" />
						</label>
						<input type="submit" value="Submit" />
					</form>
				</div>
				<div>
					<form onSubmit={(event) =>{
						event.preventDefault()
						this.props.solveReport(this.reportID.value)}}>
  						<label> 
							ID of report to solve:
							<input ref ={(id) => this.reportID = id} type="text" name="id" />
						</label>

						<input type="submit" value="Submit" />
					</form>
				</div>
			</div>
		);
	}
  	}
}

export default AdminPanel;
