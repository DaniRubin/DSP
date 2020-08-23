import React from 'react';

const Cartesian = props => {
  return <div id="CartesianStat">
    <div id="ExitButton" onClick={props.exit}>X</div>
    <center>
      <table style={{ width: "85%" }} cellPadding="10">
        <thead>
          <tr>
            <th></th>
            <th>Location Vector</th>
            <th></th>
            <th></th>
            <th>Velocity Vector</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(props.resultData).map(result => {
              return <>
                <td style={{ borderLeft: "black solid 10px" }} className="CartesianParam">{props.resultData[result][0]}</td>
                <td className="CartesianParam">{props.resultData[result][1]}</td>
                <td style={{ borderRight: "black solid 10px" }} className="CartesianParam">{props.resultData[result][2]}</td>
              </>
            })}
          </tr>
        </tbody>
      </table>
    </center>
  </div>

}

export default Cartesian;