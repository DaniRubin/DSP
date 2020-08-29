import React, { useState } from 'react';
import SGP from 'sgp4';

import Fab from '@material-ui/core/Fab';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

import Vector from './results/Vector';
import Config from '../config.json';
import { predictByVector } from './js/sgp4';
import { genrateRandom } from './js/modules';


const Predict = props => {
  const [originVector, setOriginVector] = useState({});
  const [destVector, setDestVector] = useState({});
  const [originalTLE, setTLEoriginal] = useState("1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19");
  const [newTLE, setTLEgenrated] = useState("");
  const [newVec, setNewVector] = useState(null);

  const handleTextareaChange = (event) => {
    setTLEoriginal(event.target.value)
  }
  const handleGenrateRandom = (myFunc) => {
    const newVector = genrateRandom();
    myFunc(newVector);
    setNewVector(null);
  }
  const changeValueOrigin = (event, label) => {
    const newVector = { ...originVector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setOriginVector(newVector);
  }
  const changeValueDest = (event, label) => {
    const newVector = { ...destVector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setDestVector(newVector);
  }

  const clearVector = () => {
    setTLEgenrated("");
    setOriginVector({});
    setDestVector({});
    setNewVector({});
  }
  const makePrediction = () => {
    let positionAndVelocity;
    const theNewVector = {};
    var now = new Date().getTime();
    for (let i = 0; i < 6; i++) {
      positionAndVelocity = predictByVector(originVector, originalTLE, now, SGP, Config);
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
    {/* {Config.cartesianValues.map(label =>
      <TextField error={isNaN(vector[label]) && vector[label] !== undefined} label={label} variant="outlined" value={vector[label] || ""} onChange={(event) => changeValue(event, label)} />
    )} */}
    <Vector Config={Config.cartesianValues} paragraph={"origin point"} newVec={originVector} disabled={false} changeValue={changeValueOrigin} />
    <Vector Config={Config.cartesianValues} paragraph={"destination point"} newVec={destVector} disabled={false} changeValue={changeValueDest} />
    <br /><br />

    <Fab variant="extended" onClick={() => handleGenrateRandom(setOriginVector)} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Random origin
      </Fab>
    <Fab variant="extended" onClick={() => handleGenrateRandom(setDestVector)} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Random destination
      </Fab>
    <Fab variant="extended" onClick={makePrediction} disabled={!(Object.keys(destVector).length !== 0 && Object.keys(originVector).length !== 0)} style={{ marginRight: "10px" }}>
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
      return <Vector Config={Config.cartesianValues} paragraph={string} newVec={newVec[string]} disabled={true} />
    })}


  </div>
}

export default Predict;
