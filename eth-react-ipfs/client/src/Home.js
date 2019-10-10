import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";

class Home extends Component {
  	render() {
		return( 
			<div>
				{this.props.firstTime ? (
					<form onSubmit={(event) =>{
					event.preventDefault()
					this.props.addUser(this.userName.value)}}>
					<label> 
						Please start by creating your account and entering your university username
						<input ref ={(userName) => this.userName = userName} type="textarea" name="userName" />
					</label>
					<br />
					<input type="submit" value="Submit" />
				</form>
				) : (
				<Jumbotron>
					<h1> Welcome to the online University Incident Reporting System </h1>
					<p> Your account is: {this.props.account} </p>
					<p> admin account: {this.props.admin.toString()} </p>
					<p> Token Balance: {this.props.tokens} </p>
					<p> To submit an incident report proceed to the tab and fill out the form, when the submit button is pressed it will take a while to process but after around 30 seconds maximum a metamask window will pop up just press accept and the report will be submitted. This can then be viewed in the view reports tab, where the title of your report is displayed and the status will be updated when checked by administators. The token is the used to pay for the reports, this is to prevent spam and fake reports.</p>
				</Jumbotron>
				)}
			</div>
		);
	}
}

export default Home;
