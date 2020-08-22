import React from 'react';


const TLEexplain = props => {
  return <div id="TLEprops">
    <div id="ExitButton" onClick={props.exit}>X</div>
    <div id="firstLine">
      <center>
        <p className="InfoTLEExplenation">First Line</p>
        <table style={{ width: "80%" }}>
          <thead>
            <tr>
              <th>Value</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(props.resultData.firstLine).map(result => {
              return <tr>
                <td width="30%" className="parameter" >{props.resultData.firstLine[result]}</td>
                <td width="70%" className="explainParam">{result}</td>
              </tr>
            })}
          </tbody>
        </table>
      </center>
    </div>
    {/* <!-- second line --> */}
    <div id="SencondLine">
      <center>
        <p className="InfoTLEExplenation">Second Line</p>
        <table style={{ width: "80%" }}>
          <thead>
            <tr>
              <th>Value</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(props.resultData.secondLine).map(result => {
              return <tr>
                <td width="30%" className="parameter" >{props.resultData.secondLine[result]}</td>
                <td width="70%" className="explainParam">{result}</td>
              </tr>
            })}
          </tbody>
        </table>
      </center>
    </div>
  </div>
}

export default TLEexplain;