import React, { Component } from "react";

class ReportList extends Component {
	toStatus(statusNumber){
		if(statusNumber===0){
			return "REPORTED"
		} else if(statusNumber===1){
			return "ACKNOWLEDGED"
		} else if(statusNumber ===2){
			return "SOLVED"
		}
	}
	convertToGMT(blockTime){
		if(blockTime === 0){
			return "N/A"
		}else{
			let newTime = new Date(blockTime * 1000);
			return newTime.toString()
		}
	}
	
	constructor(props) {
		super(props)
		this.isAdmin = this.props.admin
		this.toStatus = this.toStatus.bind(this)
		this.convertToGMT = this.convertToGMT.bind(this)
	}

  	render() {
		return (
			<div>
				<table className='table'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Incident Title</th>
							<th>Date Reported</th>
							<th>Status</th>
							<th>Date Acknowledged</th>
							<th>Date Solved</th>
						</tr>
					</thead>
					<tbody >
						
						{this.props.reports.map((report, i) => { 
							return(
								
								<tr>
									<td>{i+1}</td>
									<td>{this.props.titles[i]}</td>
									<td>{this.convertToGMT(report.dateReported)}</td>
									<td>{this.toStatus(report.status)}</td>
									<td>{this.convertToGMT(report.dateAcked)}</td>
									<td>{this.convertToGMT(report.dateSolved)}</td>									
								</tr>
							)
						})}
       				 </tbody>
      			</table>
			</div>
  		);
  	}
}

export default ReportList;
