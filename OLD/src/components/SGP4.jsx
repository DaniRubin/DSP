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
import { convertCartesianToKepler, predictByVector } from './js/sgp4';
import { validateVector, genrateRandom } from './js/modules';

const SGP4 = props => {
  const [vector, setVectorValue] = useState({});
  const [originalTLE, setTLEoriginal] = useState("1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19");
  const [newTLE, setTLEgenrated] = useState("");
  const [newVec, setNewVector] = useState(null);

  const handleTextareaChange = (event) => {
    setTLEoriginal(event.target.value)
  }
  const handleGenrateRandom = () => {
    const newVector = genrateRandom();
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
  const makePrediction = () => {
    let positionAndVelocity;
    const theNewVector = {};
    var now = new Date().getTime();
    for (let i = 0; i < 6; i++) {
      positionAndVelocity = predictByVector(vector, originalTLE, now, SGP, Config);
      if (positionAndVelocity === false) return;
      theNewVector[`${new Date(now).toLocaleDateString()} ${new Date(now).toLocaleTimeString()}`] = positionAndVelocity;
      now += 90 * 60 * 1000;
    }
    setNewVector(theNewVector);
  }

  return <div className="SGP4div">
    <div className="TLEsection">
      <textarea id="TLEgenrator" rows="2" placeholder="insert your TLE here" value={originalTLE} onChange={handleTextareaChange} />
    </div>
    {Config.cartesianValues.map(label =>
      <TextField error={isNaN(vector[label]) && vector[label] !== undefined} label={label} variant="outlined" value={vector[label] || ""} onChange={(event) => changeValue(event, label)} />
    )}
    <br /><br />
    <Fab variant="extended" onClick={handleGenrateRandom} style={{ marginRight: "10px" }}>
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
