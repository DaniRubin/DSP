import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import DeleteIcon from '@material-ui/icons/Delete';

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

  const genrateRandom = () => {
    const newVector = {
      "Xi": Math.random() * (Math.random() < 0.5 ? 3000 + 6000 : -3000 - 6000),
      "Xj": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
      "Xk": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
      "Yi": Math.random() * (Math.random() < 0.5 ? 10 : -10),
      "Yj": Math.random() * (Math.random() < 0.5 ? 10 : -10),
      "Yk": Math.random() * (Math.random() < 0.5 ? 10 : -10),
    }
    setVectorValue(newVector)
  }

  const genrateTLE = () => {
    convertCartesianToKepler(vector, Config);
  }

  const changeValue = (event, label) => {
    const newVector = { ...vector };
    newVector[label] = event.target.value;
    console.log(newVector)
    setVectorValue(newVector);
  }
  const clearVector = () => {
    setVectorValue({});
  }
  console.log(vector);
  return <div className="SGP4div">
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
    <Fab variant="extended" onClick={clearVector}>
      <DeleteIcon style={{ marginRight: "10px", marginBottom: "5px" }} />
        CLEAR
      </Fab>
  </div>
}

export default SGP4;
