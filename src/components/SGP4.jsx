import React, { useState } from 'react';
import SGP from 'sgp4';

import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

import Vector from './results/Vector';
import Config from '../config.json';
import { convertCartesianToKepler } from './sgp4';

const validateVector = (vector) => {
  const isValid = !(vector['Xi'] !== undefined &&
    vector['Xj'] !== undefined &&
    vector['Xk'] !== undefined &&
    vector['Yi'] !== undefined &&
    vector['Yj'] !== undefined &&
    vector['Yk'] !== undefined)
  return isValid;
}

const SGP4 = props => {
  const [vector, setVectorValue] = useState({});
  const [originalTLE, setTLEoriginal] = useState("1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19");
  const [newTLE, setTLEgenrated] = useState("");
  const [newVec, setNewVector] = useState(null);

  const handleTextareaChange = (event) => {
    setTLEoriginal(event.target.value)
  }
  const genrateRandom = () => {
    const newVector = {
      "Xi": Math.random() * (Math.random() < 0.5 ? 3000 + 6000 : -3000 - 6000),
      "Xj": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
      "Xk": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
      "Yi": Math.random() * (Math.random() < 0.5 ? 10 : -10),
      "Yj": Math.random() * (Math.random() < 0.5 ? 10 : -10),
      "Yk": Math.random() * (Math.random() < 0.5 ? 10 : -10),
    }
    setVectorValue(newVector);
    setTLEgenrated("");
    setNewVector(null);
  }
  const genrateTLE = () => {
    const TLEsecondLine = convertCartesianToKepler(vector, Config, originalTLE.split('\n')[1].split(' ')[1]);
    const allTLE = originalTLE.split('\n')[0] + '\n' + TLEsecondLine;
    setTLEgenrated(allTLE);
  }
  const changeValue = (event, label) => {
    const newVector = { ...vector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setVectorValue(newVector);
  }
  const clearVector = () => {
    setVectorValue({});
    setTLEgenrated("");
    setNewVector(null);
  }
  const returnNewVectorFromPrediction = (issSatRec, now) => {
    now = new Date(now);
    const positionAndVelocity = SGP.propogate(issSatRec, now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    if (positionAndVelocity[0] !== false) {
      const newVector = {
        "Xi": positionAndVelocity.position.x,
        "Xj": positionAndVelocity.position.y,
        "Xk": positionAndVelocity.position.z,
        "Yi": positionAndVelocity.velocity.x,
        "Yj": positionAndVelocity.velocity.y,
        "Yk": positionAndVelocity.velocity.z
      }
      return newVector;
    } else {
      alert("Failed");
      return false;
    }
  }
  const makePrediction = () => {
    let positionAndVelocity;
    const theNewVector = {};
    const issSatRec = SGP.twoline2rv(newTLE.split('\n')[0], newTLE.split('\n')[1], SGP.wgs84());
    console.log(issSatRec)
    var now = new Date().getTime();
    for (let i = 0; i < 6; i++) {
      positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
      if (positionAndVelocity === false) return;
      theNewVector[`${new Date(now).toLocaleDateString()} ${new Date(now).toLocaleTimeString()}`] = positionAndVelocity;
      now += 90 * 60 * 1000;
    }
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['1 passes'] = positionAndVelocity;
    // now += 90 * 60 * 60 * 1000;
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['2 passes'] = positionAndVelocity;
    // now += 90 * 60 * 60 * 1000;
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['3 passes'] = positionAndVelocity;
    // now += 90 * 60 * 60 * 1000;
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['4 passes'] = positionAndVelocity;
    // now += 90 * 60 * 60 * 1000;
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['5 passes'] = positionAndVelocity;
    // now += 90 * 60 * 60 * 1000;
    // positionAndVelocity = returnNewVectorFromPrediction(issSatRec, now);
    // theNewVector['6 passes'] = positionAndVelocity;
    console.log(theNewVector)
    setNewVector(theNewVector);
  }
  return <div className="SGP4div">
    <div className="TLEsection">
      <textarea id="TLEgenrator" rows="2" placeholder="insert your TLE here" value={originalTLE} onChange={handleTextareaChange} />
    </div>
    {/* <br /> */}
    {Config.cartesianValues.map(label =>
      <TextField error={isNaN(vector[label]) && vector[label] !== undefined} label={label} variant="outlined" value={vector[label] || ""} onChange={(event) => changeValue(event, label)} />
    )}
    <br /><br />
    <Fab variant="extended" onClick={genrateRandom} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Genrate Random
      </Fab>
    <Fab variant="extended" onClick={genrateTLE} disabled={validateVector(vector)} style={{ marginRight: "10px" }}>
      <FlightTakeoffIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Genrate TLE
      </Fab>
    <Fab variant="extended" onClick={makePrediction} disabled={newTLE === ""} style={{ marginRight: "10px" }}>
      <FindReplaceIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Predict
      </Fab>
    <Fab variant="extended" onClick={clearVector}>
      <DeleteIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        CLEAR
      </Fab>

    <br /><br />

    {newTLE !== "" && <div class="TLEsection">
      <textarea id="TLEgenrator" rows="2" placeholder="insert your TLE here" value={newTLE} disabled />
    </div>}

    {newVec && Object.keys(newVec).map(string => {
      return <Vector Config={Config.cartesianValues} paragraph={string} newVec={newVec[string]} />
    })}


  </div>
}

export default SGP4;
