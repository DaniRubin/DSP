import React, { useState } from 'react';
import SGP from 'sgp4';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Fab from '@material-ui/core/Fab';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Vector from './results/Vector';
import Config from '../config.json';
import { predictByVector, getPointByTLE } from './js/sgp4';
import { genrateRandom, getOclidianDestance } from './js/modules';
import { predictionFunction } from './js/prediction';

const STEP_NUMBER = 100;

const Predict = props => {
  const [originVector, setOriginVector] = useState({});
  const [originalTLE, setTLEoriginal] = useState("1 46396U 20064A   20280.85752458  .00071660  29309-5  33210-3 0  9996\n2 46396  97.3320  32.8740 0314098  65.7824  84.8996 15.36902289  4547");
  const [newVec, setNewVector] = useState(null);
  const [algorithemOutput, setOutput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleTextareaChange = (event) => {
    setTLEoriginal(event.target.value)
  }
  const getU0 = (myFunc) => {
    let newVector = getPointByTLE(originalTLE, new Date(), SGP);
    myFunc(newVector);
    setNewVector(null);
  }

  const changeValueOrigin = (event, label) => {
    const newVector = { ...originVector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setOriginVector(newVector);
  }
  const callPrediction = () => {
    setLoading(true);
    setTimeout(function () {
      predictionFunction(originVector, newVec, originalTLE, setOutput, SGP, predictByVector, Config);
    }, 2000);
  }
  const clearVector = () => {
    setOriginVector({});
    setOutput("");
    setNewVector(null);
    setLoading(false);
  }
  const makePrediction = () => {
    let positionAndVelocity;
    const theNewVector = {};
    let now = new Date().getTime();
    for (let i = 0; i < 10; i++) {
      now += 90 * 60 * 1000;
      positionAndVelocity = getPointByTLE(originalTLE, now, SGP);
      if (positionAndVelocity === false) return;
      theNewVector[`U${i + 1} : ${new Date(now).toLocaleDateString()} ${new Date(now).toLocaleTimeString()}`] = positionAndVelocity;
    }
    setNewVector(theNewVector);
  }

  return <div className="SGP4div">
    <div className="TLEsection">
      <textarea id="TLEgenrator" rows="2" placeholder="insert your TLE here" value={originalTLE} onChange={handleTextareaChange} />
    </div>
    <Vector Config={Config.cartesianValues} paragraph={"origin point"} newVec={originVector} disabled={false} changeValue={changeValueOrigin} />
    <br /><br />

    <Fab variant="extended" onClick={() => getU0(setOriginVector)} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Get initial point
      </Fab>
    <Fab variant="extended" onClick={makePrediction} style={{ marginRight: "10px" }}>
      <ThreeSixtyIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Genrate all 10 measurments
      </Fab>
    <Fab variant="extended" onClick={callPrediction} disabled={!(Object.keys(originVector).length !== 0)} style={{ marginRight: "10px" }}>
      <FindReplaceIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        Predict
      </Fab>
    <Fab variant="extended" onClick={clearVector}>
      <DeleteIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        CLEAR
      </Fab>

    <br /><br />


    {newVec && <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>All 10 estimated measurments</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Object.keys(newVec).map(string => {
          return <Vector Config={Config.cartesianValues} paragraph={`${string} : ${getOclidianDestance(newVec[string], originVector)} `} newVec={newVec[string]} disabled={true} />
        })}
      </AccordionDetails>
    </Accordion>}


    {loading && !algorithemOutput && <div className="loader"></div>}

    {algorithemOutput && <TextareaAutosize
      class="outputTextBox"
      rowsMax={4}
      aria-label="maximum height"
      placeholder="here is the output"
      value={algorithemOutput}
    />}
    <br /><br />

  </div>
}

export default Predict;
