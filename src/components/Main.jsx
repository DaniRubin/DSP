import React, { useState } from 'react';

import Options from './Options'
import Button from './Button'
import { readFile, returnFunctionByOption } from './main.js';
import TLEexplain from './results/TLEexplain';
import Keplerian from './results/Keplarian';

import Config from '../config.json';
import Cartesian from './results/Cartesian';


const Main = props => {
  const [choosenOption, changeChoosenOption] = useState(null);
  const [showObject, toggleShowObject] = useState(false);
  const [resultData, setResultData] = useState({});
  const [tleContent, setTLEcontent] = useState(
    "1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19"
  );

  const convertFunc = () => {
    toggleShowObject(true);
    if (choosenOption == null) alert("יש לבחור פונקציונליות");
    else setResultData(returnFunctionByOption(choosenOption)(tleContent, Config));
  }
  const handleChooseOption = (option) => {
    changeChoosenOption(option);
    toggleShowObject(false);
  }
  const handleTextareaChange = (event) => {
    setTLEcontent(event.target.value)
  }
  return <div>
    <Options convertTo={handleChooseOption} choosenOption={choosenOption} />
    <textarea id="textTLE" rows="4" placeholder="insert your TLE here" value={tleContent} onChange={handleTextareaChange} />
    <input className="uploadTLE" type="file" name="file" accept=".txt" onChange={(e) => readFile(e, setTLEcontent)} />
    <Button convertFunc={convertFunc} />
    {choosenOption === "TLE" && showObject && <TLEexplain resultData={resultData} exit={() => toggleShowObject(false)} />}
    {choosenOption === "Keplarian" && showObject && <Keplerian resultData={resultData} exit={() => toggleShowObject(false)} />}
    {choosenOption === "Cartesian" && showObject && <Cartesian resultData={resultData} exit={() => toggleShowObject(false)} />}
  </div>
}

export default Main;