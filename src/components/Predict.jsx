import React, { useState } from 'react';
import SGP from 'sgp4';

import Fab from '@material-ui/core/Fab';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

import Vector from './results/Vector';
import Config from '../config.json';
import { predictByVector, getPointByTLE } from './js/sgp4';
import { genrateRandom, getOclidianDestance } from './js/modules';

const STEP_NUMBER = 100;

const Predict = props => {
  const [originVector, setOriginVector] = useState({});
  const [originalTLE, setTLEoriginal] = useState("1 72001C 20070B   20280.52157813  .00584889  00000-0  97456-3 0    02\n2 72001  53.0030  84.7370 0013258 321.4366 301.2507 16.01836729    18");
  const [newTLE, setTLEgenrated] = useState("");
  const [newVec, setNewVector] = useState(null);

  const handleTextareaChange = (event) => {
    setTLEoriginal(event.target.value)
  }
  const getU0 = (myFunc) => {
    let newVector = getPointByTLE(originalTLE, new Date(), SGP);
    myFunc(newVector);
    setNewVector(null);
  }

  // const handleGenrateRandom = (myFunc) => {
  //   const newVector = genrateRandom();
  //   myFunc(newVector);
  //   setNewVector(null);
  // }
  const changeValueOrigin = (event, label) => {
    const newVector = { ...originVector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setOriginVector(newVector);
  }
  const clearVector = () => {
    setTLEgenrated("");
    setOriginVector({});
    setNewVector({});
  }
  const makePrediction = () => {
    let positionAndVelocity;
    const theNewVector = {};
    let now = new Date().getTime();
    for (let i = 0; i <= 10; i++) {
      positionAndVelocity = getPointByTLE(originalTLE, now, SGP);
      if (positionAndVelocity === false) return;
      theNewVector[`U${i} : ${new Date(now).toLocaleDateString()} ${new Date(now).toLocaleTimeString()}`] = positionAndVelocity;
      now += 90 * 60 * 1000;
    }
    setNewVector(theNewVector);
  }

  return <div className="SGP4div">
    <div className="TLEsection">
      <textarea id="TLEgenrator" rows="2" placeholder="insert your TLE here" value={originalTLE} onChange={handleTextareaChange} />
    </div>
    <Vector Config={Config.cartesianValues} paragraph={"origin point"} newVec={originVector} disabled={false} changeValue={changeValueOrigin} />
    {/* <Vector Config={Config.cartesianValues} paragraph={"destination point"} newVec={destVector} disabled={false} changeValue={changeValueDest} /> */}
    <br /><br />

    <Fab variant="extended" onClick={() => getU0(setOriginVector)} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Get initial point
      </Fab>
    <Fab variant="extended" onClick={makePrediction} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Genrate all 10 measurments
      </Fab>
    <Fab variant="extended" onClick={makePrediction} disabled={!(Object.keys(originVector).length !== 0)} style={{ marginRight: "10px" }}>
      <FindReplaceIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Predict
      </Fab>
    <Fab variant="extended" onClick={clearVector}>
      <DeleteIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        CLEAR
      </Fab>

    <br /><br />


    {newVec && Object.keys(newVec).map(string => {
      return <Vector Config={Config.cartesianValues} paragraph={`${string} : ${getOclidianDestance(newVec[string], originVector)} `} newVec={newVec[string]} disabled={true} />
    })}

    <br /><br />

  </div>
}

export default Predict;
