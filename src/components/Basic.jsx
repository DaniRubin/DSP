import React, { useState } from 'react';

import { readFile, returnFunctionByOption } from './main.js';
import Button from './UI/Button'
import Config from '../config.json';
import Results from './results/Results.jsx';

const Basic = props => {
  const [tleContent, setTLEcontent] = useState("1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19");
  const [resultData, setResultData] = useState({});

  const convertFunc = () => {
    props.toggleShowObject(true);
    if (props.choosenOption == null) alert("יש לבחור פונקציונליות");
    else setResultData(returnFunctionByOption(props.choosenOption)(tleContent, Config));
  };

  const handleTextareaChange = (event) => {
    setTLEcontent(event.target.value)
  }

  return <div>
    <textarea id="textTLE" rows="4" placeholder="insert your TLE here" value={tleContent} onChange={handleTextareaChange} />
    <input className="uploadTLE" type="file" name="file" accept=".txt" onChange={(e) => readFile(e, setTLEcontent)} />
    <Button convertFunc={convertFunc} />
    {props.showObject && <Results choosenOption={props.choosenOption} exit={() => props.toggleShowObject(false)} resultData={resultData} />}
  </div>
}

export default Basic;