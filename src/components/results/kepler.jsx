import React from 'react';

const Kepler = props => {
	console.log(props.resultData);
	return <div id="KeplerStat">
		<div id="ExitButton" onclick={props.exit}>X</div>
		<center>
			<table style={{ width: "85%" }} cellpadding="10">
				<thead>
					<tr>
						{Object.keys(props.resultData).map(result => {
							return <th key={result}>{result}</th>
						})}
					</tr>
				</thead>
				<tbody>
					<tr>
						{Object.keys(props.resultData).map(result => {
							return <td key={props.resultData[result]} className="keplerParam">{props.resultData[result]}</td>
						})}
					</tr>
				</tbody>
			</table >
		</center>
	</div>
}

export default Kepler;