import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import CryptoJS from "crypto-js";

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class ReportForm extends Component {

	constructor(props){
		super(props);
		this.state = { 	checked: false,
						userName: "",
						title: "",
						date: "",
						description: "",
						validated: false}
	}
	
	handleCheck = (e) => {
		const {checked} = e.target
		this.setState({ checked: checked})
	}
	
	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value })
	}

	handleSubmit= async (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false){
			event.preventDefault();
			event.stopPropagation();
		}
		event.preventDefault();
		event.stopPropagation();
		this.setState({validated: true})
		if(this.state.checked){
			const newUserName = CryptoJS.AES.encrypt(form.userName.value, this.props.aesKey).toString()	
			const newTitle = CryptoJS.AES.encrypt(form.title.value, this.props.aesKey).toString()
			const newDescription= CryptoJS.AES.encrypt(form.description.value, this.props.aesKey).toString()
			const ipfsHash = await ipfs.addJSON({ userName: newUserName, title: newTitle, date: form.date.value, description: newDescription})
			this.props.createReport(ipfsHash, this.state.checked)
		}else{
			const ipfsHash = await ipfs.addJSON({ userName: form.userName.value, title: form.title.value, date: form.date.value, description: form.description.value})
			this.props.createReport(ipfsHash, this.state.checked)
		}
		
	}
	
  	render() {
  		return (
  			<div>
				{this.props.tokens === 0 ? (
				<Jumbotron>
					<h1> Unfortunately you have used all your reporting tokens please wait until your previous reports have been acknowledged or contact IT services</h1>
					<p> Token Balance: {this.props.tokens} </p>
				</Jumbotron>
				) : (
				<Form validated={this.state.validated} onSubmit={this.handleSubmit}>
					<Form.Group controlId="formIssueReport">
						<Form.Label>Full Name</Form.Label>
						<Form.Control
							required
							type="text"
							name="userName"
							onChange={this.handleChange}
							value={this.state.userName}
							placeholder="Full name"
						/>
						<br />
						
						<Form.Label>Title</Form.Label>
						<Form.Control
							required
							type="text"
							name="title"
							onChange={this.handleChange}
							value={this.state.title}
							placeholder="Title"
						/>
						<br />
						
						<Form.Label>Date Of incident</Form.Label>
						<Form.Control
							required
							type="datetime"
							name="date"
							onChange={this.handleChange}
							value={this.state.date}
							placeholder="DD/MM/YY"
						/> <br />
						
						<Form.Label>Description</Form.Label>
						<Form.Control
							required
							type="textarea"
							name="description"
							onChange={this.handleChange}
							value={this.state.description}
							placeholder="Please make this as specific as possible"
						/>
						
						<Form.Label>Anonymous?</Form.Label>
						<Form.Check 
							onChange={e=> this.handleCheck(e)}
							defaultChecked={this.state.checked} 
						/>
						<br />
					</Form.Group>
					<Button type="submit">Issue Report</Button>
				</Form>	
				)}		
			</div>
  		);
  	}
}

export default ReportForm;
